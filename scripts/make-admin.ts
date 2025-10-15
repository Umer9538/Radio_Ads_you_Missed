/**
 * Script to promote a user to ADMIN or SUPER_ADMIN role
 *
 * Usage:
 *   npm run make-admin <email> [role]
 *
 * Examples:
 *   npm run make-admin user@example.com ADMIN
 *   npm run make-admin user@example.com SUPER_ADMIN
 */

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function makeAdmin(email: string, role: 'ADMIN' | 'SUPER_ADMIN' = 'ADMIN') {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found`)
      console.log('\n💡 Tip: Create an account first by signing up at /auth/signup')
      process.exit(1)
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    console.log('\n✅ User successfully promoted to', role)
    console.log('\n👤 User Details:')
    console.log('   ID:', updatedUser.id)
    console.log('   Email:', updatedUser.email)
    console.log('   Name:', `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim() || 'Not set')
    console.log('   Role:', updatedUser.role)
    console.log('\n🎉 You can now access the admin dashboard at /admin')
    console.log('   Make sure to sign out and sign back in for changes to take effect!')

  } catch (error) {
    console.error('❌ Error promoting user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get command line arguments
const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('📋 Usage: npm run make-admin <email> [role]')
  console.log('\nExamples:')
  console.log('  npm run make-admin user@example.com ADMIN')
  console.log('  npm run make-admin user@example.com SUPER_ADMIN')
  console.log('\nRoles:')
  console.log('  ADMIN       - Standard admin with full access')
  console.log('  SUPER_ADMIN - Super admin with additional privileges (default: ADMIN)')
  process.exit(0)
}

const email = args[0]
const role = (args[1]?.toUpperCase() === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN') as 'ADMIN' | 'SUPER_ADMIN'

makeAdmin(email, role)
