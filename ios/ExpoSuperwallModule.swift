import Foundation
import ExpoModulesCore
import SuperwallKit

public class ExpoSuperwallModule: Module {
    public func definition() -> ModuleDefinition {
        let purchaseController = RCPurchaseController()
        let customSuperwallDelegate = CustomSuperwallDelegate(self)
        
        Name("ExpoSuperwall")
        
        Events(ON_PAYWALL_DISMSS, ON_PAYWALL_PRESENT, ON_PAYWALL_ERROR, ON_PAYWALL_SKIP, ON_CUSTOM_PAYWALL_ACTION)
        
        // https://superwall.com/docs/configuring-the-sdk
        Function("configure") { (superwallApiKey: String) in
            Superwall.configure(
                apiKey: superwallApiKey,
                purchaseController: purchaseController
            )
            Superwall.shared.delegate = customSuperwallDelegate
        }
        
        Function("syncSubscriptionStatus") { (revenueCatApiKey: String) in
            purchaseController.syncSubscriptionStatus(revenueCatApiKey: revenueCatApiKey)
        }
        
        // https://superwall.com/docs/identity-management
        Function("identify") { (userId: String) in
            Superwall.shared.identify(userId: userId)
        }
        
        // https://superwall.com/docs/identity-management
        Function("reset") { () in
            Superwall.shared.reset()
        }
        
        // https://superwall.com/docs/setting-user-properties
        Function("setUserAttributes") { (attributes: [String: Any]) in
            Superwall.shared.setUserAttributes(attributes)
        }
        
        // https://superwall.com/docs/advanced-configuration
        Function("getSubscriptionStatus") {() in
            return Superwall.shared.subscriptionStatus.rawValue
        }
        
        // https://superwall.com/docs/feature-gating
        AsyncFunction("register") { (event: String, params: [String: Any]?, promise: Promise) in
            let handler = PaywallPresentationHandler()
            handler.onDismiss { paywallInfo in
                self.sendEvent(ON_PAYWALL_DISMSS, nsObjectToDictionary(paywallInfo))
            }
            handler.onPresent { paywallInfo in
                self.sendEvent(ON_PAYWALL_PRESENT, nsObjectToDictionary(paywallInfo))
            }
            handler.onError { error in
                self.sendEvent(ON_PAYWALL_ERROR, [
                    "description": error.localizedDescription
                ])
            }
            handler.onSkip { reason in
                switch reason {
                case .userIsSubscribed:
                    self.sendEvent(ON_PAYWALL_SKIP, [
                        "reason": "userIsSubscribed"
                    ])
                case .holdout(let experiment):
                    let experimentAsDictionary = try? experiment.asDictionary()
                    
                    self.sendEvent(ON_PAYWALL_SKIP, [
                        "reason": "holdout",
                        "experimentId": experiment.id,
                        "experiment": experimentAsDictionary
                    ])
                case .noRuleMatch:
                    self.sendEvent(ON_PAYWALL_SKIP, [
                        "reason": "noRuleMatch",
                    ])
                case .eventNotFound:
                    self.sendEvent(ON_PAYWALL_SKIP, [
                        "reason": "notPartOfCampaign",
                    ])
                }
            }
            
            Superwall.shared.register(event: event, params: params, handler: handler) {
                promise.resolve()
            }
        }
        
        // https://superwall.com/docs/feature-gating
        // https://sdk.superwall.me/documentation/superwallkit/superwall/getpresentationresult(forevent:params:completion:)
        AsyncFunction("getPresentationResult") { (forEvent: String, params: [String : Any]?, promise: Promise) in
            Superwall.shared.getPresentationResult(
                forEvent: forEvent,
                params: params,
                completion: { (presentationResult) in
                    switch presentationResult {
                    case .eventNotFound:
                        promise.resolve(["value": "eventNotFound"])
                    case .noRuleMatch:
                        promise.resolve(["value": "noRuleMatch"])
                    case .paywall(let experiment):
                        promise.resolve(["value": "paywall", "experiment": nsObjectToDictionary(experiment)])
                    case .holdout(let experiment):
                        promise.resolve(["value": "holdout", "experiment": nsObjectToDictionary(experiment)])
                    case .userIsSubscribed:
                        promise.resolve(["value": "userIsSubscribed"])
                    case .paywallNotAvailable:
                        promise.resolve(["value": "paywallNotAvailable"])
                    }
                }
            )
        }
    }
}

extension Encodable {
    func asDictionary() throws -> [String: Any] {
        let data = try JSONEncoder().encode(self)
        guard let dictionary = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] else {
            throw NSError()
        }
        return dictionary
    }
}
