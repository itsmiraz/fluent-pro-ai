import { redirect } from 'next/navigation';
import React from 'react'

const Page = () => {
  redirect("/dashboard");
}

export default Page