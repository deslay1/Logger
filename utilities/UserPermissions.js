import Constants from "expo-constants";
import * as Permissions from "expo-permissions";

class UserPermissions {
  getCameraPermission = async () => {
    if (Constants.platform.ios || Constants.platform.android) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status != "granted") {
        alert("Permission to access camera roll is required to upload an image");
      }
    }
  };
}

export default new UserPermissions();
