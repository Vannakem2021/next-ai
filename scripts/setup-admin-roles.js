#!/usr/bin/env node

/**
 * Admin Roles Setup Script
 * 
 * This script helps set up Clerk organization roles for the admin panel.
 * Run this after creating an organization in your Clerk dashboard.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('\n🔧 Admin Panel Setup Helper\n');
  console.log('This script will guide you through setting up admin roles in Clerk.\n');

  console.log('📋 Required Steps:\n');
  console.log('1. Create an organization in your Clerk Dashboard');
  console.log('2. Set up the following roles in Organizations → Roles & Permissions:');
  console.log('   - org:super_admin (Full system access)');
  console.log('   - org:admin (Admin panel access)');
  console.log('   - org:moderator (Content moderation access)');
  console.log('3. Assign users to the organization with appropriate roles\n');

  const hasOrganization = await askQuestion('Have you created an organization in Clerk Dashboard? (y/n): ');
  
  if (hasOrganization.toLowerCase() !== 'y') {
    console.log('\n❌ Please create an organization first:');
    console.log('1. Go to https://dashboard.clerk.com');
    console.log('2. Select your application');
    console.log('3. Navigate to Organizations');
    console.log('4. Create a new organization');
    console.log('5. Run this script again\n');
    rl.close();
    return;
  }

  const hasRoles = await askQuestion('Have you set up the admin roles (super_admin, admin, moderator)? (y/n): ');
  
  if (hasRoles.toLowerCase() !== 'y') {
    console.log('\n❌ Please set up roles first:');
    console.log('1. Go to Organizations → Roles & Permissions in Clerk Dashboard');
    console.log('2. Create these roles:');
    console.log('   - Name: "Super Admin", Key: "org:super_admin"');
    console.log('   - Name: "Admin", Key: "org:admin"');
    console.log('   - Name: "Moderator", Key: "org:moderator"');
    console.log('3. Run this script again\n');
    rl.close();
    return;
  }

  const hasMembers = await askQuestion('Have you assigned users to the organization with admin roles? (y/n): ');
  
  if (hasMembers.toLowerCase() !== 'y') {
    console.log('\n❌ Please assign users to organization:');
    console.log('1. Go to Organizations → Members in Clerk Dashboard');
    console.log('2. Add yourself and other admin users');
    console.log('3. Assign appropriate roles (admin, moderator, etc.)');
    console.log('4. Run this script again\n');
    rl.close();
    return;
  }

  console.log('\n✅ Great! Your Clerk organization is set up.');
  
  const removeTemporary = await askQuestion('Do you want to remove temporary access and enable production security? (y/n): ');
  
  if (removeTemporary.toLowerCase() === 'y') {
    console.log('\n🔒 To enable production security:');
    console.log('1. Open src/hooks/useAdminAuth.ts');
    console.log('2. Find this line:');
    console.log('   console.log("useAdminAuth: No admin roles found, allowing temporary access for authenticated user");');
    console.log('   return true;');
    console.log('3. Replace "return true;" with "return false;"');
    console.log('4. Remove the console.log line');
    console.log('5. Test that only users with admin roles can access the admin panel\n');
  }

  console.log('🎉 Setup complete! Your admin panel is ready.');
  console.log('\n📋 Next steps:');
  console.log('- Test admin access with a user who has admin roles');
  console.log('- Test that users without roles get access denied');
  console.log('- Verify page reload works without redirects');
  console.log('- Check that all admin features work correctly\n');

  rl.close();
}

main().catch(console.error);
