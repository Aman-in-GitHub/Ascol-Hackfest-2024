import { Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Text from '@/components/Text';
import ReadBook from '@/assets/icons/OpenBook.svg';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Magic from '@/assets/icons/Magic.svg';

export const SafetyTipsSections = [
  {
    title: 'Safety at home',
    key: 'home',
    tips: [
      {
        subTitle: 'Doors & Locks',
        title:
          'Make sure you have good locks on all doors and windows – that’s the first line of defense.'
      },
      {
        subTitle: 'Lighting',
        title:
          'Keep areas well-lit at night, especially doorways. Use motion sensors or consider adding outdoor lighting.'
      },
      {
        subTitle: 'Emergency Contacts',
        title:
          'Create a list of trusted friends, family members, and emergency contacts in case you need to reach someone quickly.'
      },
      {
        subTitle: 'Use a peephole or security camera',
        title:
          'Before opening the door, make sure you have a peephole or security camera.'
      },
      {
        subTitle: 'Be cautious with strangers',
        title:
          'Don’t open the door to unfamiliar people or share personal details.'
      },
      {
        subTitle: 'Keep communication devices handy',
        title: 'Ensure your phone is charged and within reach.'
      }
    ],
    images: [
      require('../../assets/home/image1.png'),
      require('../../assets/home/image2.png'),
      require('../../assets/home/image3.png'),
      require('../../assets/home/image4.png'),
      require('../../assets/home/image5.png'),
      require('../../assets/home/image6.png')
    ]
  },
  {
    title: 'Safety in public',
    key: 'public',
    tips: [
      {
        subTitle: 'Trust Your Instincts',
        title:
          'If you feel unsafe, get out of the situation! You know what’s right for you.'
      },
      {
        subTitle: 'Stay in well-lit areas',
        title: 'Avoid walking alone in poorly lit or isolated areas.'
      },
      {
        subTitle: 'Group Up',
        title:
          'Travelling with friends makes you safer and helps keep an eye on each other.'
      },
      {
        subTitle: 'Report Unwanted Behavior',
        title:
          'If you see something that’s not right (like someone being harassed), let a security person or a trusted adult know. They can help!'
      },
      {
        subTitle: 'Don’t display valuables',
        title:
          'Avoid showing expensive items like jewelry or large amounts of cash.'
      },
      {
        subTitle: 'Keep your phone ready',
        title: 'Have your phone easily accessible in case of emergencies.'
      },
      {
        subTitle: 'Choose a route that’s close to a hospital or police station',
        title:
          'If you’re in a public place, choose a route that’s close to a hospital or police station.'
      }
    ],
    images: [
      require('../../assets/public/image1.png'),
      require('../../assets/public/image2.png'),
      require('../../assets/public/image3.png'),
      require('../../assets/public/image4.png'),
      require('../../assets/public/image5.png'),
      require('../../assets/public/image6.png'),
      require('../../assets/public/image7.png'),
      require('../../assets/public/image8.png'),
      require('../../assets/public/image9.png')
    ]
  },
  {
    title: 'Safety at work',
    key: 'work',
    tips: [
      {
        subTitle: 'Share Your Location',
        title:
          'Let a trusted person know where you are working, especially if it’s your first time there! Use apps that allow location sharing with your family and friends for extra safety.'
      },
      {
        subTitle: 'Set Boundaries',
        title:
          'It’s okay to say no to requests or work hours that make you feel uncomfortable.'
      },
      {
        subTitle: 'Travel Safely',
        title:
          'Plan routes in advance, avoid travelling alone late at night or into deserted areas. Take public transportation with secure options and share your route with someone.'
      },
      {
        subTitle: 'Park in well-lit areas close to the building entrance',
        title:
          'If you’re travelling to work, park in well-lit areas close to the building entrance.'
      },
      {
        subTitle: 'Know emergency exits',
        title:
          'Familiarize yourself with workplace emergency protocols and exits.'
      }
    ],
    images: [
      require('../../assets/work/image1.png'),
      require('../../assets/work/image2.png'),
      require('../../assets/work/image3.png'),
      require('../../assets/work/image4.png'),
      require('../../assets/work/image5.png')
    ]
  },
  {
    title: 'Safety in transport',
    key: 'transport',
    tips: [
      {
        subTitle: 'Wait for public transport in well-lit, populated areas',
        title:
          'When using public transport, wait for the bus or train to arrive in well-lit, populated areas.'
      },
      {
        subTitle:
          'Stay alert and avoid using headphones or looking at your phone',
        title:
          'Avoid using headphones or looking at your phone while travelling.'
      },
      {
        subTitle: 'Sit near the driver or in a populated train car',
        title:
          'When travelling by train, sit near the driver or in a populated train car.'
      },
      {
        subTitle: 'Use trusted services',
        title:
          'Opt for licensed public transportation or reputable ride-sharing apps.'
      },
      {
        subTitle: 'Share your ride details',
        title:
          'Send your ride information to a trusted friend or family member.'
      }
    ],
    images: [
      require('../../assets/transport/image1.png'),
      require('../../assets/transport/image2.png'),
      require('../../assets/transport/image3.png'),
      require('../../assets/transport/image4.png'),
      require('../../assets/transport/image5.png')
    ]
  },
  {
    title: 'Safety while travelling',
    key: 'travel',
    tips: [
      {
        subTitle: 'Plan ahead',
        title:
          'Research your destination and accommodations thoroughly. Know local emergency contacts and safety protocols.'
      },
      {
        subTitle: 'Keep documents safe',
        title:
          'Carry copies of your passport, ID, and other important documents, storing them separately from the originals.'
      },
      {
        subTitle: 'Use trusted transportation',
        title:
          'Always opt for official taxis, licensed rideshare apps, or reputable public transport. Avoid unmarked vehicles.'
      },
      {
        subTitle: 'Stay connected',
        title:
          'Share your itinerary, location, and travel plans with a trusted person back home.'
      },
      {
        subTitle: 'Blend in',
        title:
          'Avoid drawing attention by dressing modestly and not flaunting valuables like jewelry, electronics, or cash.'
      },
      {
        subTitle: 'Stay aware in public',
        title:
          'Keep an eye on your surroundings, especially in crowded or unfamiliar areas. Stay cautious of pickpockets and scams.'
      },
      {
        subTitle: 'Secure your accommodations',
        title:
          'Ensure your hotel or rental has proper security measures. Use door locks, safes, and, if available, door chains.'
      },
      {
        subTitle: 'Carry self-defense items',
        title:
          'If legally permissible, carry non-lethal defense items such as pepper spray, a whistle, or a personal safety alarm.'
      },
      {
        subTitle: 'Keep essentials handy',
        title:
          'Carry a small day bag with essential items like your phone, ID, a charger, some cash, and any necessary medications.'
      }
    ],
    images: [
      require('../../assets/travel/image1.png'),
      require('../../assets/travel/image2.png'),
      require('../../assets/travel/image3.png'),
      require('../../assets/travel/image4.png'),
      require('../../assets/travel/image5.png'),
      require('../../assets/travel/image6.png'),
      require('../../assets/travel/image7.png'),
      require('../../assets/travel/image8.png'),
      require('../../assets/travel/image9.png')
    ]
  },
  {
    title: 'Safety on the internet',
    key: 'internet',
    tips: [
      {
        subTitle: 'Secure Your Devices',
        title:
          'Use strong passwords and two-factor authentication on all accounts, especially bank accounts, email, social media, etc.'
      },
      {
        subTitle: 'Limit Sharing Personal Information',
        title:
          'Never share personal details like your address, phone number, or travel plans online without verifying the platform’s security and privacy policies.'
      },
      {
        subTitle: 'Social Media Safety',
        title:
          'Be mindful of what you post online. Avoid posting sensitive information about yourself or where you are.'
      },
      {
        subTitle: 'Strong Passwords',
        title:
          'Never use the same password for multiple accounts. Make them long and unique! Use two-factor authentication whenever possible (think of it like an extra lock on your account)'
      },
      {
        subTitle: 'Think Before You Share',
        title:
          'Don’t share personal info online without knowing where that platform is safe to share.'
      },
      {
        subTitle: 'Avoid meeting online acquaintances in person alone',
        title:
          'If you’re meeting someone online, avoid meeting them in person alone.'
      }
    ],
    images: [
      require('../../assets/internet/image1.png'),
      require('../../assets/internet/image2.png'),
      require('../../assets/internet/image3.png'),
      require('../../assets/internet/image4.png'),
      require('../../assets/internet/image5.png'),
      require('../../assets/internet/image6.png')
    ]
  }
];

function SafetyTips() {
  const { styles, theme } = useStyles(stylesheet);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} hidden={false} />
      <Text isBold={true} style={styles.heading}>
        Better Safe than Sorry
      </Text>
      <Text style={styles.tip}>
        TIP - If something feels weird or unsafe, leave!
      </Text>
      <View style={styles.buttonWrapper}>
        {SafetyTipsSections.map((section, index) => (
          <Pressable
            key={index}
            style={styles.readButton}
            onPress={() => router.push(`/tips-page/${index}`)}
          >
            <Text isWhite={true} style={styles.buttonText}>
              {section.title}
            </Text>
            <ReadBook fill={theme.colors.whiteColor} width={24} height={24} />
          </Pressable>
        ))}
      </View>

      <LinearGradient
        colors={['#a2d2ff', '#8900f2', '#ffafcc']}
        style={styles.aiButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Link href={'/AskAi'} asChild>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              gap: 15
            }}
          >
            <Magic fill={theme.colors.whiteColor} width={32} height={32} />
            <Text isWhite={true} isBold={true} style={styles.text}>
              SURAKSHYA AI
            </Text>
          </Pressable>
        </Link>
      </LinearGradient>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8
  },
  heading: {
    fontSize: theme.fontSize.xl,
    marginTop: 5
  },
  buttonWrapper: {
    flexDirection: 'column',
    gap: 8,
    marginVertical: 5
  },
  tip: {
    fontSize: theme.fontSize.sm,
    marginVertical: 5
  },
  readButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.default,
    padding: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonText: {
    fontSize: theme.fontSize.lg
  },
  aiButton: {
    marginTop: 10,
    padding: 18,
    alignItems: 'center',
    borderRadius: theme.borderRadius.rounded
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 24,
    fontFamily: 'HeadingFont'
  }
}));

export default SafetyTips;
