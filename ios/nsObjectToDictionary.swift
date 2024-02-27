public func nsObjectToDictionary(_ object: NSObject) -> [String: Any] {
    var dictionary = [String: Any]()
    
    let mirror = Mirror(reflecting: object)
    for child in mirror.children {
        if let label = child.label {
            if !label.hasPrefix("_") {
                let value = child.value
                dictionary[label] = serializeValue(value)
            }
        }
    }
    
    return dictionary
}

private func serializeValue(_ value: Any) -> Any {
    if let jsonSerializable = value as Any?, isJSONSerializable(jsonSerializable) {
        // If the property is JSON serializable, return value as is
        return jsonSerializable
    }
        
    else if let arrayValue = value as? [Any] {
        // If the property is an array, recursively serialize its contents
        let serializedArray = arrayValue.map { element -> Any in
            return serializeValue(element)
        }
        return serializedArray
    }
    
    else if let dictValue = value as? [String: Any] {
        // If the property is a dictionary, recursively serialize its contents
        let serializedDict = dictValue.mapValues { element -> Any in
            return serializeValue(element)
        }
        return serializedDict
    }
    
    else if let url = value as? URL {
        // Variable is a `URL` object
        return url.absoluteString
    }
    
    else if let encodable = value as? Encodable {
        // If property is an Encodable, serialize it
        if let data = try? JSONEncoder().encode(encodable) {
            if let dictionary = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? [String: Any] {
                return dictionary
            }
        }
        return ""
    }
    
    else if let nestedNsObject = value as? NSObject {
        // If the property is an NSObject, recursively convert it to a dictionary
        return nsObjectToDictionary(nestedNsObject)
    }
    
    return ""
}

private func isJSONSerializable(_ value: Any) -> Bool {
    switch value {
    case is String, is Int, is Double, is Bool, Optional<Any>.none:
        return true
    default:
        return false
    }
}
