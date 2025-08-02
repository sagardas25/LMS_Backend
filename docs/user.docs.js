/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get currently logged-in user's profile
 *     description: Returns the profile details of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64d1fe3d8e464b1b1b24a3cb"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+919999999999"
 *                     role:
 *                       type: string
 *                       example: "student"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     country:
 *                       type: string
 *                       example: "India"
 *                     avatar:
 *                       type: string
 *                       format: uri
 *                       example: "https://cdn.example.com/avatar.jpg"
 *                     bio:
 *                       type: string
 *                       example: "Passionate learner and aspiring developer."
 *                     enrolledCourses:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "64e3a1f28b0b28e60cfb93c1"
 *                     createdCourse:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "64e3a1f28b0b28e60cfb93c2"
 *                     lastActive:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-02T12:34:56.789Z"
 *
 *       401:
 *         description: Unauthorized – Token missing or invalid
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/user/update:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update the profile of the currently logged-in user
 *     description: Allows users to update their full name, bio, and avatar image.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               bio:
 *                 type: string
 *                 example: Developer and tech enthusiast.
 *               avatar:
 *                 type: string
 *                 format: binary
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64d1fe3d8e464b1b1b24a3cb"
 *                     fullName:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+919999999999"
 *                     role:
 *                       type: string
 *                       example: "student"
 *                     gender:
 *                       type: string
 *                       example: "male"
 *                     country:
 *                       type: string
 *                       example: "India"
 *                     avatar:
 *                       type: string
 *                       format: uri
 *                       example: "https://cdn.example.com/avatar.jpg"
 *                     bio:
 *                       type: string
 *                       example: "Developer and tech enthusiast."
 *                     enrolledCourses:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "64e3a1f28b0b28e60cfb93c1"
 *                     createdCourse:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "64e3a1f28b0b28e60cfb93c2"
 *                     lastActive:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-02T12:34:56.789Z"
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       400:
 *         description: No valid fields provided for update
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Error while updating user profile
 *       500:
 *         description: Server error during update (including Cloudinary error)
 */
