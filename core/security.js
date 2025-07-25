// Singularity - Security Module v4.0 (Based on LifeOS)
// Handles all cryptographic operations and authentication.
// Uses Web Crypto API for industry-standard encryption.

if (!Singularity) { var Singularity = {}; }

Singularity.security = {
    // Configuration
    PBKDF2_ITERATIONS: 100000,
    SALT_LENGTH: 16,
    IV_LENGTH: 12,

    // State
    encryptionKey: null,
    isAuthenticated: false,

    /**
     * Derives an encryption key from a master password and salt using PBKDF2.
     * @param {string} password - The master password.
     * @param {Uint8Array} salt - The salt.
     * @returns {Promise<CryptoKey>} - The derived encryption key.
     */
    deriveKey: async function(password, salt) {
        const passwordBuffer = new TextEncoder().encode(password);
        const importedKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: this.PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            importedKey,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    },

    /**
     * Generates a random salt.
     * @returns {Uint8Array} - A new salt.
     */
    generateSalt: function() {
        return crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    },

    /**
     * Encrypts a plaintext string using AES-GCM.
     * @param {string} plaintext - The data to encrypt.
     * @param {CryptoKey} key - The encryption key.
     * @returns {Promise<string>} - A string containing iv and ciphertext, base64 encoded.
     */
    encrypt: async function(plaintext, key) {
        if (!key) throw new Error("Encryption key not available.");

        const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
        const encodedData = new TextEncoder().encode(plaintext);

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encodedData
        );

        // Combine IV and ciphertext into one buffer
        const resultBuffer = new Uint8Array(iv.length + ciphertext.byteLength);
        resultBuffer.set(iv, 0);
        resultBuffer.set(new Uint8Array(ciphertext), iv.length);

        // Return as a base64 string for easy storage
        return btoa(String.fromCharCode.apply(null, resultBuffer));
    },

    /**
     * Decrypts a ciphertext string using AES-GCM.
     * @param {string} encryptedString - The base64 encoded iv and ciphertext.
     * @param {CryptoKey} key - The decryption key.
     * @returns {Promise<string>} - The decrypted plaintext.
     */
    decrypt: async function(encryptedString, key) {
        if (!key) throw new Error("Decryption key not available.");

        const encryptedData = new Uint8Array(atob(encryptedString).split('').map(c => c.charCodeAt(0)));
        const iv = encryptedData.slice(0, this.IV_LENGTH);
        const ciphertext = encryptedData.slice(this.IV_LENGTH);

        try {
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                ciphertext
            );
            return new TextDecoder().decode(decrypted);
        } catch (error) {
            console.error("Decryption failed. Likely incorrect password.", error);
            throw new Error("Decryption failed");
        }
    },
    
    /**
     * Authenticates the user by deriving a key and attempting to decrypt a test string.
     * @param {string} password - The password entered by the user.
     * @param {string} saltBase64 - The base64 encoded salt from storage.
     * @param {string} testStringEncrypted - The encrypted test string from storage.
     * @returns {Promise<boolean>} - True if authentication is successful.
     */
    authenticate: async function(password, saltBase64, testStringEncrypted) {
        try {
            const salt = new Uint8Array(atob(saltBase64).split('').map(c => c.charCodeAt(0)));
            const key = await this.deriveKey(password, salt);
            await this.decrypt(testStringEncrypted, key); // This will throw an error if password is wrong
            
            this.encryptionKey = key;
            this.isAuthenticated = true;
            console.log("Authentication successful. Encryption key set.");
            return true;
        } catch (error) {
            console.error("Authentication failed.");
            this.isAuthenticated = false;
            this.encryptionKey = null;
            return false;
        }
    },

    /**
     * Sets up a new master password, creating a salt and an encrypted test string.
     * @param {string} newPassword - The new master password.
     * @returns {Promise<{salt: string, testString: string}>} - The base64 encoded salt and test string.
     */
    setupMasterPassword: async function(newPassword) {
        const salt = this.generateSalt();
        const key = await this.deriveKey(newPassword, salt);
        const testString = await this.encrypt("Singularity_SECRET_VERIFICATION", key);

        this.encryptionKey = key;
        this.isAuthenticated = true;

        return {
            salt: btoa(String.fromCharCode.apply(null, salt)),
            testString: testString
        };
    }
};