import { redirect } from "next/navigation.js";
import React from "react";

const page = () => {
  redirect("/home");
  return <div></div>;
};

export default page;
