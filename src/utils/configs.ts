const COMPATIBILITY_DATE = "2024-04-05";

export const generateWranglerToml = (
  projectName: string,
  useStorage: boolean = true,
  msgFrequency: number = 16,
  autosaveInterval: number = 30000,
) => {
  return `name = "${projectName}"
main = "./index.mjs"
compatibility_date = ${COMPATIBILITY_DATE}

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

export const generateSyncoJson = (
  projectName: string,
  useStorage: boolean = false,
  msgFrequency: number = 16,
  autosaveInterval: number = 30000,
) => {
  return `
  {
    "projectName": "${projectName}",
    "compatibilityDate": "$${COMPATIBILITY_DATE}",
    "msgFrequency": ${msgFrequency},
    "useStorage": ${useStorage},
    "autosaveInterval": ${autosaveInterval}
  }
  `
}
