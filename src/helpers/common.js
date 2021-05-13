
import firebase from "firebase";

class CommonHelper {
    static async uploadStorageFirebase(imageData) {
        var imgURL = '';
        var name = Date().toString() + imageData.name;
        var storage = firebase.storage();
        var imageStorageRef = storage
          .ref()
          .child("AdminStorage/images/" + name);

        await imageStorageRef
          .put(imageData)
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
                imgURL = url; 
          })
          .catch(console.error);

          return imgURL;
    }

    static getLocation(location) {
      let data = location.split(";");
      let temp = data[1];
      let address = temp.split(":");

      return address[1].toString();
    }

    static getLocationShort(location, length) {
      let data = location.split(";");
      let temp = data[1];
      let address = temp.split(":");
      if(address[1].toString().length < 20) {
        return address[1].toString();
      } else {
        return address[1].toString().substring(0, length)+"...";
      }
   
    }

    static removeItem(arr, item) {
      return arr.filter(f => f.doctorId !== item.doctorId);
      
    }
   }
   
   export default CommonHelper