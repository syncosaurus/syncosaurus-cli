export const generateWranglerToml = (projectName: string) => {
  return `name = "${projectName}"
main = "./index.mjs"
compatibility_date = "2024-02-28"

[[durable_objects.bindings]]
name = "SYNCOSAURUS_WEBSOCKET_SERVER"
class_name = "WebSocketServer"

[[migrations]]
tag = "v1"
new_classes = ["WebSocketServer"]`
}

export const generateSyncoJson = (projectName: string) => {
  return `
  {
    "projectName": "${projectName}",
    "compatibilityDate": "${new Date().toISOString().slice(0, 10)}",
    "encryption": false,
    "authentication": false,
    "serverMsgFrequency": 16
  }
  `
}
