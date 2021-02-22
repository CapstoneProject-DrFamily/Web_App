
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

    static removeItem(arr, item) {
      return arr.filter(f => f.doctorId !== item.doctorId);
      
    }
   }
   
   export default CommonHelper