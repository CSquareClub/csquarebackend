const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Event = require('./models/Event');
const TeamMember = require('./models/TeamMember');
const FacultyMember = require('./models/FacultyMember');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/c-square-club', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedData() {
  console.log('🌱 Seeding sample data...');
  
  try {
    // Sample Events
    const sampleEvents = [
      {
        title: 'Hackathon 2024',
        description: 'Join us for an exciting 48-hour coding challenge where innovation meets creativity.',
        date: new Date('2024-03-15'),
        time: '10:00 AM',
        location: 'Main Campus',
        category: 'Competition',
        type: 'upcoming',
        imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop'
      },
      {
        title: 'Web Development Workshop',
        description: 'Learn modern web development techniques with React and Node.js.',
        date: new Date('2024-02-28'),
        time: '2:00 PM',
        location: 'Computer Lab 1',
        category: 'Workshop',
        type: 'past',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
      },
      {
        title: 'AI/ML Symposium',
        description: 'Exploring the future of artificial intelligence and machine learning.',
        date: new Date('2024-04-10'),
        time: '9:00 AM',
        location: 'Auditorium',
        category: 'Symposium',
        type: 'upcoming',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
      }
    ];

    // Sample Team Members
    const sampleTeam = [
      {
        name: 'Alex Johnson',
        position: 'President',
        bio: 'Passionate about technology and leading the next generation of developers.',
        initials: 'AJ',
        isCore: true,
        skills: ['Leadership', 'Python', 'AI/ML'],
        specialization: 'Artificial Intelligence',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
      },
      {
        name: 'Sarah Chen',
        position: 'Vice President',
        bio: 'Expert in full-stack development with a focus on user experience.',
        initials: 'SC',
        isCore: true,
        skills: ['React', 'Node.js', 'UI/UX'],
        specialization: 'Full-Stack Development',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b192?w=400&h=300&fit=crop'
      },
      {
        name: 'Mike Rodriguez',
        position: 'Technical Lead',
        bio: 'Backend specialist with expertise in scalable system architecture.',
        initials: 'MR',
        isCore: true,
        skills: ['Node.js', 'MongoDB', 'Docker'],
        specialization: 'Backend Development',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop'
      }
    ];

    // Sample Faculty
    const sampleFaculty = [
      {
        name: 'Dr. Michael Thompson',
        designation: 'Professor',
        department: 'Computer Science',
        bio: 'Leading researcher in artificial intelligence and machine learning.',
        expertise: ['AI/ML', 'Data Science', 'Research'],
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop'
      },
      {
        name: 'Dr. Lisa Rodriguez',
        designation: 'Associate Professor',
        department: 'Software Engineering',
        bio: 'Expert in software architecture and distributed systems.',
        expertise: ['Software Architecture', 'Cloud Computing', 'DevOps'],
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop'
      }
    ];

    // Clear existing data and insert sample data
    await Event.deleteMany({});
    await TeamMember.deleteMany({});
    await FacultyMember.deleteMany({});
    
    const insertedEvents = await Event.insertMany(sampleEvents);
    const insertedTeam = await TeamMember.insertMany(sampleTeam);
    const insertedFaculty = await FacultyMember.insertMany(sampleFaculty);
    
    console.log('✅ Sample data inserted successfully!');
    console.log(`📊 Inserted: ${insertedEvents.length} events, ${insertedTeam.length} team members, ${insertedFaculty.length} faculty`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedData();
