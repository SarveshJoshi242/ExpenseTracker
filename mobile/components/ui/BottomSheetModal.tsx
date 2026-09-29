import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomSheetModal as GBottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps
} from '@gorhom/bottom-sheet';
import { useThemeStore } from '../../store/themeStore';
import { Colors } from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
}

export const BottomSheetModal = forwardRef<GBottomSheetModal, Props>(({
  children,
  snapPoints = ['50%', '90%'],
  onDismiss
}, ref) => {
  const { isDark } = useThemeStore();
  const theme = isDark ? Colors.dark : Colors.light;
  
  const snaps = useMemo(() => snapPoints, [snapPoints]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.5}
    />
  );

  return (
    <GBottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snaps}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.border }}
    >
      <View style={styles.container}>
        {children}
      </View>
    </GBottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
