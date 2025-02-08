// import { Stack } from 'expo-router';

// export default function Layout() {
//   return <Stack />;
// }
// import { Stack } from "expo-router";

// import SelectedOptionsProvider from "./src/Componentes/Context/SelectedOptionsProvider";

// export default function Layout() {

//   return (
//     <SelectedOptionsProvider>
//       <Stack />
//     </SelectedOptionsProvider>

//   );
// }
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SelectedOptionsProvider from "./src/Componentes/Context/SelectedOptionsProvider";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SelectedOptionsProvider>
        <Stack />
      </SelectedOptionsProvider>
    </SafeAreaProvider>
  );
}