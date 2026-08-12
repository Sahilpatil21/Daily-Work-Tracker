import bcrypt from 'bcryptjs';
import User from './models/User.js';
import WorkEntry from './models/WorkEntry.js';

const DEFAULT_USER = {
  name: 'sdtools09patil',
  email: 'sdtools09patil@sdtools.com',
  password: '123',
  companyName: 'S D TOOLS'
};

const assignOrphanWorkEntries = async (userId) => {
  const result = await WorkEntry.updateMany(
    { user: { $exists: false } },
    { $set: { user: userId } }
  );

  if (result.modifiedCount > 0) {
    console.log(`Assigned ${result.modifiedCount} orphan work entries to sdtools09patil`);
  } else {
    console.log('No orphan work entries were found.');
  }
};

const seedDefaultUser = async () => {
  try {
    let user = await User.findOne({
      $or: [
        { email: DEFAULT_USER.email.toLowerCase() },
        { name: DEFAULT_USER.name }
      ]
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
      user = await User.create({
        name: DEFAULT_USER.name,
        email: DEFAULT_USER.email.toLowerCase(),
        password: hashedPassword,
        companyName: DEFAULT_USER.companyName
      });
      console.log('Seeded default user: sdtools09patil');
    } else {
      console.log('Default user already exists.');
    }

    await assignOrphanWorkEntries(user._id);
  } catch (error) {
    console.error('Could not seed default user:', error);
  }
};

export default seedDefaultUser;
