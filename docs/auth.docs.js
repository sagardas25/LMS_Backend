/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and Authorization routes
 */

/**
 * @swagger
 * api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - gender
 *               - phoneNumber
 *               - avatar
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               phoneNumber:
 *                 type: string
 *                 example: "+911234567890"
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user and generate access & refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user and clear tokens
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       209:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * api/v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token using refresh token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or missing refresh token
 */

/**
 * @swagger
 * api/v1/auth/refresh-token:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token using refresh token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or missing refresh token
 */

/**
 * @swagger
 * api/v1/auth/update-password:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Update user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * api/v1/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request a password reset link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Email is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset password using token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
