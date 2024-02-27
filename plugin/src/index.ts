import { withXcodeProject, type ConfigPlugin } from "@expo/config-plugins";
import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import fs from "node:fs";
import path from "node:path";

/**
 * Config plugin to setup ExpoSuperwall
 * */
export const withSuperwall: ConfigPlugin = (config) => {
  return withXcodeProject(config, async (config) => {
    // Fix "Multiple commands produce Assets.car" error when building
    // Put this in the post_integrate do |installer| section
    // https://dev.to/kylefoo/xcode-12-new-build-system-warns-multiple-commands-produce-assets-car-56im
    const SRC_TO_ADD_TO_PODFILE = `
      project_path = '${config.modRequest.projectName}.xcodeproj'
      project = Xcodeproj::Project.open(project_path)
      project.targets.each do |target|
          build_phase = target.build_phases.find { |bp| bp.display_name == '[CP] Copy Pods Resources' }
          assets_path = '\${TARGET_BUILD_DIR}/\${UNLOCALIZED_RESOURCES_FOLDER_PATH}/Assets.car'
          if build_phase.present? && build_phase.output_paths.include?(assets_path) == true
              build_phase.output_paths.delete(assets_path)
          end
      end
      project.save(project_path)
    `.trim();

    const file = path.join(config.modRequest.platformProjectRoot, "Podfile");
    const contents = await fs.promises.readFile(file, "utf8");
    await fs.promises.writeFile(
      file,
      addPodDepsToTargets(contents, SRC_TO_ADD_TO_PODFILE),
      "utf8"
    );
    return config;
  });
};

function addPodDepsToTargets(src: string, SRC_TO_ADD_TO_PODFILE: string) {
  return mergeContents({
    tag: `with-fix-superwall`,
    src,
    newSrc: SRC_TO_ADD_TO_PODFILE.trim(),
    anchor: /^\s*post_integrate\s+do\s+\|\s*installer\s*\|\s*$/,
    offset: 6,
    comment: "#",
  }).contents;
}

export default withSuperwall;
