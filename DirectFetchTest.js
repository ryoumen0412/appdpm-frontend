/**
 * Direct test from React Native environment
 * Add this to your App.js temporarily to test
 */

import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";

export default function DirectFetchTest() {
  const testFetch = async () => {
    console.log("[TEST] Starting direct fetch test...");

    try {
      const url = "http://100.126.196.33:5000/api/auth/login";
      const body = {
        rut_usuario: "11111111-1",
        password: "test1234",
      };

      console.log("[TEST] URL:", url);
      console.log("[TEST] Body:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log("[TEST] Response status:", response.status);
      console.log("[TEST] Response ok:", response.ok);

      const text = await response.text();
      console.log("[TEST] Response text:", text);

      const json = JSON.parse(text);
      console.log("[TEST] Response JSON:", json);

      if (json.success && json.data?.token) {
        console.log(
          "[TEST] ✅ SUCCESS! Token:",
          json.data.token.substring(0, 50)
        );
      } else {
        console.log("[TEST] ❌ FAILED:", json.error || json.message);
      }
    } catch (error) {
      console.error("[TEST] ❌ EXCEPTION:", error);
      console.error("[TEST] Error name:", error.name);
      console.error("[TEST] Error message:", error.message);
    }
  };

  useEffect(() => {
    testFetch();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Direct Fetch Test</Text>
      <Text>Check console for results</Text>
      <Button title="Test Again" onPress={testFetch} />
    </View>
  );
}
