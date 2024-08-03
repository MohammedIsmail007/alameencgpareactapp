import React from "react";

const AdminLogin = () => {
  return (
    <>
      <div className="flex justify-center flex-col items-center font-serif">
        <h1 className=" text-3xl">ADMIN LOGIN</h1>
        <main>
          <form
            action={<AdminLogin />}
            className=" flex flex-col justify-center items-center m-3"
          >
            <div className="p-2">
              <label for="username" className=" text-xl">
                Username:
              </label>
              <input
                className=" border-2 rounded-sm m-2"
                type="text"
                id="username"
                name="username"
                required
              />
            </div>
            <div className="p-2">
              <label for="password" className=" text-xl">
                Password:
              </label>
              <input
                className=" border-2 rounded-sm m-2"
                type="password"
                id="password"
                name="password"
                required
              />
            </div>
            <button
              type="submit"
              className=" text-xl rounded-sm text-white bg-blue-900 m-2 p-2"
            >
              Login
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default AdminLogin;
