const mongoose = require('mongoose');
const Room = require('../models/Room');
require('dotenv').config();

const createNetworkingRoom = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberverse');
    
    const networkingRoom = new Room({
      title: "Networking Fundamentals",
      slug: "networking-fundamentals",
      short_description: "Learn core networking concepts essential for cybersecurity and ethical hacking.",
      long_description_markdown: "Understanding networking is crucial, as all ethical hacking is done over networks (LANs/WANs). This room covers the OSI and TCP/IP models, IP addressing, common protocols, LAN fundamentals, network scanning with Nmap, service enumeration, and passive reconnaissance techniques.",
      difficulty: "Beginner",
      category: "Networking",
      estimated_time_minutes: 240,
      tags: ["networking", "nmap", "reconnaissance", "tcp-ip", "osi-model"],
      topics: [
        {
          id: 1,
          title: "What is Networking?",
          order: 1,
          estimated_time_minutes: 45,
          content_markdown: "Networking is the practice of connecting computers and other devices to share resources and communicate. In this lecture, we'll explore the OSI and TCP/IP models, which are fundamental frameworks for understanding how data travels across networks. The OSI model has 7 layers (Physical, Data Link, Network, Transport, Session, Presentation, Application), while TCP/IP has 4 layers. We'll also cover IP addressing, which assigns unique identifiers to devices, and common protocols like HTTP (web traffic), DNS (domain name resolution), and SMTP (email)."
        },
        {
          id: 2,
          title: "Introduction to LAN",
          order: 2,
          estimated_time_minutes: 40,
          content_markdown: "A Local Area Network (LAN) connects devices within a limited geographical area, such as a home, office, or building. LANs use technologies like Ethernet and Wi-Fi to enable high-speed communication between devices. Key components include switches (connect devices within the same network), routers (connect different networks), and access points (provide wireless connectivity). Understanding LAN topology, addressing schemes, and security considerations is essential for network design and cybersecurity."
        },
        {
          id: 3,
          title: "Nmap - Network Scanning",
          order: 3,
          estimated_time_minutes: 50,
          content_markdown: "Nmap (Network Mapper) is a powerful open-source tool used for network discovery and security auditing. It can discover hosts on a network, determine open ports and services, detect operating systems, and identify security vulnerabilities. Common Nmap scans include: TCP SYN scan (-sS), UDP scan (-sU), service version detection (-sV), and OS detection (-O). Nmap is essential for penetration testing and network security assessments, helping identify potential attack vectors."
        },
        {
          id: 4,
          title: "Network Services",
          order: 4,
          estimated_time_minutes: 45,
          content_markdown: "Network services are applications that run on networked devices to provide specific functionality. Common services include HTTP/HTTPS (web servers), SSH (secure remote access), FTP (file transfer), DNS (domain name resolution), SMTP (email), and SMB (file sharing). Service enumeration is a critical step in ethical hacking, involving the identification and analysis of running services to find potential vulnerabilities. Tools like Nmap, Netcat, and specialized scripts help enumerate services and gather information about their versions and configurations."
        },
        {
          id: 5,
          title: "Passive Reconnaissance",
          order: 5,
          estimated_time_minutes: 40,
          content_markdown: "Passive reconnaissance involves gathering information about a target without directly interacting with their systems, making it harder to detect. Key tools include: whois (domain registration information), nslookup (DNS queries), dig (detailed DNS information), and Google dorking (advanced search techniques). These tools help identify domain ownership, IP addresses, subdomains, email addresses, and technology stack information. Passive reconnaissance is often the first step in a penetration test, providing valuable intelligence while maintaining stealth."
        }
      ],
      quizzes: [{
        id: 1,
        title: "Networking Fundamentals Quiz",
        order: 1,
        time_limit_seconds: 600,
        pass_percentage: 70,
        questions: [
          {
            id: 1,
            type: "single",
            question_text: "Which layer of the OSI model is responsible for routing packets between networks?",
            options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
            correct_answer: 2,
            points: 10,
            explanation: "The Network Layer (Layer 3) is responsible for routing packets between different networks."
          },
          {
            id: 2,
            type: "single",
            question_text: "What device is primarily used to connect multiple devices within the same LAN segment?",
            options: ["Router", "Switch", "Hub", "Modem"],
            correct_answer: 1,
            points: 10,
            explanation: "A switch is used to connect multiple devices within the same network segment."
          },
          {
            id: 3,
            type: "single",
            question_text: "Which Nmap flag is used to perform a TCP SYN scan?",
            options: ["-sT", "-sS", "-sU", "-sV"],
            correct_answer: 1,
            points: 10,
            explanation: "The -sS flag performs a TCP SYN scan, also known as a stealth scan."
          },
          {
            id: 4,
            type: "single",
            question_text: "Which port is commonly used by the SSH service?",
            options: ["21", "22", "23", "25"],
            correct_answer: 1,
            points: 10,
            explanation: "SSH (Secure Shell) commonly uses port 22."
          },
          {
            id: 5,
            type: "single",
            question_text: "Which tool is best for gathering detailed DNS information about a domain?",
            options: ["whois", "nslookup", "dig", "ping"],
            correct_answer: 2,
            points: 10,
            explanation: "The dig command provides detailed DNS information and is more flexible than nslookup."
          }
        ]
      }]
    });

    await networkingRoom.save();
    console.log('✅ Networking Fundamentals room created successfully!');
    console.log(`Room ID: ${networkingRoom._id}`);
    console.log(`Slug: ${networkingRoom.slug}`);
    
  } catch (error) {
    console.error('❌ Error creating networking room:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the script
createNetworkingRoom();