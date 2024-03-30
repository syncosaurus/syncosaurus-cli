export const generateWranglerToml = (
  projectName: string,
  useStorage: boolean = true,
  msgFrequency: number = 16,
  autosaveInterval: number = 30000,
) => {
  return `name = "${projectName}"
main = "./index.mjs"
compatibility_date = "2024-02-28"

[[durable_objects.bindings]]
name = "SYNCOSAURUS_WEBSOCKET_SERVER"
class_name = "WebSocketServer"

[[migrations]]
tag = "v1"
new_classes = ["WebSocketServer"]

[vars]
ALLOWED_ORIGIN = "http://localhost:5173"
USE_STORAGE = ${useStorage}
MSG_FREQUENCY = ${msgFrequency}
AUTOSAVE_INTERVAL = ${autosaveInterval}`
}

export const generateSyncoJson = (projectName: string, enableRoomStorage: boolean = false) => {
  return `
  {
    "projectName": "${projectName}",
    "compatibilityDate": "${new Date().toISOString().slice(0, 10)}",
    "encryption": false,
    "authentication": false,
    "serverMsgFrequency": 16,
    "enableRoomStorage": ${enableRoomStorage}
  }
  `
}
