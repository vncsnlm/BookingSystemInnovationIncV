import { useUser } from '@auth0/nextjs-auth0/client';

/*
export const handleFetchEvents = () => {
  return new Promise((resolve, reject) => {
    
    const { user, isLoading } = useUser();

    if (!user) {
      alert("Please sign in");
      reject(new Error("User is not signed in"));
      return;
    }

    const userEmail = user.email;

    const url = new URL("/api/events", window.location.origin);
    url.searchParams.append("user", userEmail);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        // Handle fetch errors
        reject(error);
      });
  });
};
*/

/*
export const handleFetchEvents = (requestData) => {
  return new Promise((resolve, reject) => {
    fetch("/api/events", {
      method: "POST", // Assuming you want to send data with a POST request
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData) // Convert requestData to JSON string
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};*/


//Backup here

export const handleFetchEvents = () => {
  return new Promise((resolve, reject) => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((json) => {
        return resolve(json);
      })
      .catch((error) => {
        reject(error);
      });
  });
};