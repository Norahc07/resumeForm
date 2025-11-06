/**
 * Script to create default admin user
 * Run this after setting up Firebase
 * 
 * Usage: node scripts/create-admin-user.js
 * 
 * Or use Firebase Console:
 * 1. Authentication > Add user
 * 2. Email: admin@resumeform.local
 * 3. Password: michigi2025
 * 4. Firestore: Create document at artifacts/resume-builder/users/{UID}/roles/admin_status
 *    with { isAdmin: true }
 */

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // You'll need to download this from Firebase

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@resumeform.local',
  password: 'michigi2025',
  appId: 'resume-builder' // Change this to match your APP_ID
};

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create user in Authentication
    const userRecord = await auth.createUser({
      email: DEFAULT_ADMIN.email,
      password: DEFAULT_ADMIN.password,
      displayName: 'Admin',
      emailVerified: true
    });

    console.log('✅ User created in Authentication:', userRecord.uid);

    // Create admin document in Firestore
    const adminDocRef = db.doc(
      `artifacts/${DEFAULT_ADMIN.appId}/users/${userRecord.uid}/roles/admin_status`
    );

    await adminDocRef.set({
      isAdmin: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      username: DEFAULT_ADMIN.username
    });

    console.log('✅ Admin document created in Firestore');
    console.log('\n📋 Admin Credentials:');
    console.log('   Username: admin');
    console.log('   Password: michigi2025');
    console.log('\n✅ Admin user setup complete!');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  User already exists. Updating admin status...');
      
      // Get existing user
      const userRecord = await auth.getUserByEmail(DEFAULT_ADMIN.email);
      
      // Create/update admin document
      const adminDocRef = db.doc(
        `artifacts/${DEFAULT_ADMIN.appId}/users/${userRecord.uid}/roles/admin_status`
      );

      await adminDocRef.set({
        isAdmin: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        username: DEFAULT_ADMIN.username
      });

      console.log('✅ Admin status updated!');
      process.exit(0);
    } else {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  }
}

createAdminUser();

