export function getProfileImgUrl(filename) {
  if (!filename) return "http://localhost:8080/images/baseprofile.png";
  return `http://localhost:8080/images/${filename}`;
}
