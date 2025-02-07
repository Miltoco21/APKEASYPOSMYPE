// import { Stack } from 'expo-router';

// export default function Layout() {
//   return <Stack />;
// }
import { Stack } from "expo-router";

import SelectedOptionsProvider from "./src/Componentes/Context/SelectedOptionsProvider";

export default function Layout() {

  return (
    <SelectedOptionsProvider>
      <Stack />
    </SelectedOptionsProvider>

  );
}
