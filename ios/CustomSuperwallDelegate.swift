import SuperwallKit

// https://sdk.superwall.me/documentation/superwallkit/superwalldelegate/
// https://sdk.superwall.me/documentation/superwallkit/superwalldelegate/handlecustompaywallaction(withname:)-41i56
class CustomSuperwallDelegate: SuperwallDelegate {
    var expoSuperwallModule: ExpoSuperwallModule
    
    init(_ expoSuperwallModule: ExpoSuperwallModule) {
        self.expoSuperwallModule = expoSuperwallModule
    }
    
    // https://superwall.com/docs/custom-paywall-events
    func handleCustomPaywallAction(withName name: String) {
        self.expoSuperwallModule.sendEvent(ON_CUSTOM_PAYWALL_ACTION, ["name": name])
    }
}
