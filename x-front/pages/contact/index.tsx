import React, { useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function ContactForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { userInfo } = useAuth();

  // This effect will prepopulate the form fields if userInfo is available
  useEffect(() => {
    if (userInfo) {
      setValue("email", userInfo.email);
      setValue("name", userInfo.username); // Assuming you want to prefill the name with the username
    }
  }, [userInfo, setValue]);

  const onSubmit = data => console.log(data);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-w-4xl p-12 bg-cultured rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-rich-black">Name</label>
          <Input
            id="name"
            name="name"
            placeholder="Your Name"
            {...register("name", { required: true })}
            className={`mt-1 p-3 w-full border ${errors.name ? "border-red-500" : "border-sonic-silver"} rounded-md shadow-sm text-rich-black`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-2">Name is required.</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-rich-black">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className={`mt-1 p-3 w-full border ${errors.email ? "border-red-500" : "border-sonic-silver"} rounded-md shadow-sm text-rich-black`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-2">Valid email is required.</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-rich-black">Message</label>
          <Input
            as="textarea"
            id="message"
            name="message"
            {...register("message", { required: true })}
            className={`mt-1 p-3 w-full border ${errors.message ? "border-red-500" : "border-sonic-silver"} rounded-md shadow-sm h-40 text-rich-black align-top`} // Added align-top class
          />
          {errors.message && <p className="text-red-500 text-xs mt-2">Message is required.</p>}
        </div>

        <Button type="submit" className="px-6 py-3 bg-deep-sky-blue text-white rounded-md hover:bg-cerulean-blue text-lg">Send Message</Button>
      </form>
    </div>
  );
}
