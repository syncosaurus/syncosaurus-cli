export const generateWranglerToml = (projectName: string) => {
  return `name = "${projectName}"
main = "./index.mjs"
compatibility_date = "2024-03-27"

[[durable_objects.bindings]]
name = "WEBSOCKET_SERVER"
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
    "authentication": false
  }
  `
}
