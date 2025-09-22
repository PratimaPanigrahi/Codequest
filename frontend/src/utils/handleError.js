// src/utils/handleError.js
export const handleError = (error) => {
  if (!error) return { message: "Unknown error", type: "unknown" };

  let message = "";
  let type = "unknown";

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Mongo duplicate key error
    if (data?.code === 11000) {
      type = "validation";
      message = "User already exists, please login.";
    }
    // Server errors
    else if (status >= 500) {
      type = "server";
      message = data?.message || "Server error. Please try again later.";
    }
    // Auth errors
    else if (status === 401 || status === 403) {
      type = "auth";
      message = data?.message || "Unauthorized. Please login again.";
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
    }
    // Validation errors
    else if (status >= 400) {
      type = "validation";
      message = data?.message || "Request validation failed.";
    } else {
      type = "unknown";
      message = data?.message || "An error occurred.";
    }
  } else if (error.request) {
    type = "network";
    message = "No response from server. Please check your connection.";
  } else {
    message = error.message || "Something went wrong.";
  }

  return { message, type };
};
