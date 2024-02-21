# Alo Clone Overview

This repository contains the source code for a fully featued clone of the Alo Yoga e-commerce platform. The project aims to replicate the essential functionalities and user experience of Alo Yoga's online store, focusing on providing a seamless shopping experience for activewear enthusiasts.

## Features

The Alo Clone will incorporate several key features to create a fully-comprehensive e-commerce experience:

- **User Authentication**: Implements secure login and signup processes, currently limited GitHub OAuth integration for streamlined access.
- **Product Catalog**: Users can explore a variety of activewear products, sorted into categories such as Men's and Women's clothing, along with accessories.
- **Product Details**: Detailed pages for each product, showcasing images (hosted on an S3 bucket), available sizes, pricing, and descriptions.
- **Shopping Cart**: An intuitive cart system where users can add items, adjust quantities, and review their potential purchases.
- **Checkout Process**: Integration with Stripe for secure and efficient checkout experiences, allowing users to complete their purchases with ease.
- **Responsive Design**: The design is fully responsive, ensuring a seamless shopping experience across various devices and screen sizes.

## Technologies

This project leverages a modern tech stack to deliver a high-quality application with a positive user experience in mind:

- **Frontend**: Utilizes React and Next.js 14 for a dynamic, server-side rendered user interface.
- **Styling**: Tailwind CSS is used for its utility-first approach to styling, facilitating responsive design implementation.
- **Backend**: Node.js serves as the runtime environment, with Prisma ORM for database interactions.
- **Database**: PostgreSQL is employed for persistent storage of user, product, and transaction data.
- **Authentication**: Lucia is integrated for handling authentication workflows and session management.
- **Image Storage**: Product images are stored and managed using an Amazon S3 bucket.
- **Payment Processing**: Stripe is integrated to handle secure payment transactions during checkout.

## Database Design and Schema

The database schema is thoughtfully designed to include tables and relations for users, sessions, shopping carts, cart items, and products. It also utilizes enums for product sizes and categories to ensure data consistency.

Please refer to the following Excalidraw diagram for a visual representation of the schema:

[View Database Schema Diagram](https://excalidraw.com/#json=yCkLsEg6Us-doD651LtMf,ZklpkR0FOkxxjHvU-jdzPg)

![Screenshot 2024-02-21 at 3 00 56 AM](https://github.com/camachoo1/next14-fsa/assets/116383442/849be00b-020f-4d0c-8e2d-1916cf8b243a)


**Disclaimer**: This project is developed for education and portfolio purposes ONLY. This is not intended for commercial use. All trademarks, product names, company names and/or logos mentioned herein are the property of their respective owners.
