import Text from '@/components/Text';
import { View } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#22c55e' }}
      text2NumberOfLines={2}
      contentContainerStyle={{
        paddingHorizontal: 15
      }}
      text1Style={{
        fontSize: 14
      }}
      text2Style={{
        fontSize: 10,
        color: 'rgba(127, 127, 127, 1)'
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#dc2626' }}
      text2NumberOfLines={2}
      contentContainerStyle={{
        paddingHorizontal: 15
      }}
      text1Style={{
        fontSize: 14
      }}
      text2Style={{
        fontSize: 10,
        color: 'rgba(127, 127, 127, 1)'
      }}
    />
  )
};

export default toastConfig;
