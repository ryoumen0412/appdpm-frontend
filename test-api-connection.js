/**
 * Quick diagnostic script to test backend connectivity
 * Run: node test-api-connection.js
 */

const API_URL = "http://100.126.196.33:5000/api/auth/login";

console.log("Testing backend connection...");
console.log("Target URL:", API_URL);
console.log("Credentials: 11111111-1 / test1234\n");

fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    rut_usuario: "11111111-1",
    password: "test1234",
  }),
})
  .then((response) => {
    console.log("Status Code:", response.status);
    console.log("Status Text:", response.statusText);
    return response.json();
  })
  .then((data) => {
    console.log("\nResponse Data:");
    console.log(JSON.stringify(data, null, 2));

    if (data.success && data.data?.token) {
      console.log("\n✅ LOGIN SUCCESSFUL!");
      console.log("Token received:", data.data.token.substring(0, 50) + "...");
    } else {
      console.log("\n❌ LOGIN FAILED");
      console.log("Error:", data.error || data.message);
    }
  })
  .catch((error) => {
    console.error("\n❌ CONNECTION ERROR:");
    console.error(error.message);
    console.error("\nPossible issues:");
    console.error("- Backend server not running on 100.126.196.33:5000");
    console.error("- Network/firewall blocking connection");
    console.error("- CORS issues (if running from browser)");
  });
