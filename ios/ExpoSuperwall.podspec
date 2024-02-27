Pod::Spec.new do |s|
  s.name           = 'ExpoSuperwall'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platform       = :ios, '13.4'
  s.swift_version  = '5.4'
  s.source         = { git: 'https://github.com/Armster15/expo-superwall' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.dependency 'SuperwallKit', '~> 3.0'
  s.dependency 'RevenueCat'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
  
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
