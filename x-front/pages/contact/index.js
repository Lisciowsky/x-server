import React from 'react'

export default function index() {
  return (<div class="container mx-auto px-4 py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h2 class="text-2xl font-bold mb-4">Contact Us</h2>
      <p>If you have any questions, please feel free to reach out to us:</p>
      <ul class="mt-4">
        <li><strong>Email:</strong> contact@randomdomain.com</li>
        <li><strong>Phone:</strong> +123 456 7890</li>
        <li><strong>Address:</strong> 123 Random St, Random City, 12345</li>
      </ul>
    </div>

    <div>
      <h2 class="text-2xl font-bold mb-4">Send Us a Message</h2>
      <form action="#" method="POST">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" name="name" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm" required/>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" name="email" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm" required/>
        </div>
        <div class="mb-4">
          <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
          <textarea id="message" name="message" rows="4" class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm" required></textarea>
        </div>
        <div>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">Send Message</button>
        </div>
      </form>
    </div>
  </div>
</div>)

}
