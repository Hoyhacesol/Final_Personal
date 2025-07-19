export function getProfileImgUrl(filename) {
  if (!filename) return "http://192.168.219.247:8080/images/baseprofile.png";
  return `http://192.168.219.247:8080/images/${filename}`;
}
