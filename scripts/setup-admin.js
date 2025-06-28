// Setup Admin Script for Production
// Run this once to set up admin roles in production

const { clerkClient } = require("@clerk/clerk-sdk-node");

async function setupAdmin() {
  try {
    console.log("🔧 Setting up admin roles in production...");

    // Replace with your actual user email or user ID
    const ADMIN_EMAIL = "vannakem312@gmail.com"; // Your admin email
    const ORG_NAME = "vanna"; // Your organization name

    // 1. Find user by email
    console.log(`📧 Looking for user: ${ADMIN_EMAIL}`);
    const users = await clerkClient.users.getUserList({
      emailAddress: [ADMIN_EMAIL],
    });

    if (users.data.length === 0) {
      console.error(`❌ User not found: ${ADMIN_EMAIL}`);
      console.log("💡 Make sure the user has signed up in production first");
      return;
    }

    const user = users.data[0];
    console.log(
      `✅ Found user: ${user.firstName} ${user.lastName} (${user.id})`
    );

    // 2. Create or find organization
    console.log(`🏢 Setting up organization: ${ORG_NAME}`);
    let organization;

    try {
      // Try to create organization
      organization = await clerkClient.organizations.createOrganization({
        name: ORG_NAME,
        createdBy: user.id,
      });
      console.log(
        `✅ Created organization: ${organization.name} (${organization.id})`
      );
    } catch (error) {
      if (error.errors?.[0]?.code === "duplicate_record") {
        // Organization already exists, find it
        const orgs = await clerkClient.organizations.getOrganizationList();
        organization = orgs.data.find((org) => org.name === ORG_NAME);
        console.log(
          `✅ Found existing organization: ${organization.name} (${organization.id})`
        );
      } else {
        throw error;
      }
    }

    // 3. Add user to organization with admin role
    console.log(`👤 Adding user to organization with admin role...`);

    try {
      await clerkClient.organizations.createOrganizationMembership({
        organizationId: organization.id,
        userId: user.id,
        role: "org:admin",
      });
      console.log(`✅ User added to organization with admin role`);
    } catch (error) {
      if (error.errors?.[0]?.code === "duplicate_record") {
        console.log(`ℹ️  User is already a member of the organization`);

        // Update role to admin
        const memberships =
          await clerkClient.organizations.getOrganizationMembershipList({
            organizationId: organization.id,
          });

        const membership = memberships.data.find(
          (m) => m.publicUserData.userId === user.id
        );
        if (membership) {
          await clerkClient.organizations.updateOrganizationMembership({
            organizationId: organization.id,
            userId: user.id,
            role: "org:admin",
          });
          console.log(`✅ Updated user role to admin`);
        }
      } else {
        throw error;
      }
    }

    // 4. Verify setup
    console.log(`🔍 Verifying admin setup...`);
    const memberships =
      await clerkClient.organizations.getOrganizationMembershipList({
        organizationId: organization.id,
      });

    const adminMembership = memberships.data.find(
      (m) => m.publicUserData.userId === user.id && m.role === "org:admin"
    );

    if (adminMembership) {
      console.log(`🎉 SUCCESS! Admin setup complete:`);
      console.log(`   User: ${user.emailAddresses[0].emailAddress}`);
      console.log(`   Organization: ${organization.name}`);
      console.log(`   Role: ${adminMembership.role}`);
      console.log(`   Organization ID: ${organization.id}`);
    } else {
      console.error(`❌ Admin setup verification failed`);
    }
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
    if (error.errors) {
      console.error("Error details:", error.errors);
    }
  }
}

// Run the setup
setupAdmin();
