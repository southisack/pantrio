import { useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../src/constants/tokens';
import { useSessionStore } from '../src/hooks/sessionStore';
import { detectIngredients } from '../src/api/detectIngredients';
import type { CapturedPhoto } from '../src/types';

const MAX_PHOTOS = 3;

export default function CaptureScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const { photos, addPhoto, removePhoto, setIngredients } = useSessionStore();

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || photos.length >= MAX_PHOTOS) return;

    const result = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
    if (!result?.base64 || !result.uri) return;

    const photo: CapturedPhoto = {
      id: Math.random().toString(36).slice(2, 10),
      uri: result.uri,
      base64: result.base64,
    };
    addPhoto(photo);
  }, [photos.length, addPhoto]);

  const handleAnalyze = useCallback(async () => {
    if (photos.length === 0) return;
    setAnalyzing(true);
    setAnalyzeError(null);

    try {
      const ingredients = await detectIngredients(photos);
      setIngredients(ingredients);
      router.push('/ingredient-review');
    } catch {
      setAnalyzeError("Something went sideways. Worth a retry.");
    } finally {
      setAnalyzing(false);
    }
  }, [photos, setIngredients]);

  // Permission not yet determined
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>Camera access needed.</Text>
          <Text style={styles.permissionBody}>
            Pantrio needs to see your fridge. That requires camera access.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonLabel}>Grant access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const canCapture = photos.length < MAX_PHOTOS && !analyzing;
  const canAnalyze = photos.length > 0 && !analyzing;

  return (
    <View style={styles.container}>
      {/* Camera viewfinder */}
      <CameraView ref={cameraRef} style={styles.camera} facing={'back' as CameraType} />

      {/* Top overlay — photo count */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="none">
        {photos.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{photos.length}/{MAX_PHOTOS}</Text>
          </View>
        )}
      </SafeAreaView>

      {/* Bottom controls */}
      <SafeAreaView style={styles.bottomOverlay}>
        {/* Thumbnail strip */}
        {photos.length > 0 && (
          <ScrollView
            horizontal
            style={styles.thumbnailScroll}
            contentContainerStyle={styles.thumbnailRow}
            showsHorizontalScrollIndicator={false}
          >
            {photos.map((photo) => (
              <View key={photo.id} style={styles.thumbnailWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(photo.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.removeX}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Error message */}
        {analyzeError && (
          <Text style={styles.errorText}>{analyzeError}</Text>
        )}

        {/* Capture row */}
        <View style={styles.captureRow}>
          {/* Analyze button — left side, appears once there's a photo */}
          <View style={styles.analyzeSlot}>
            {photos.length > 0 && (
              <TouchableOpacity
                style={[styles.analyzeButton, !canAnalyze && styles.buttonDisabled]}
                onPress={handleAnalyze}
                disabled={!canAnalyze}
              >
                {analyzing ? (
                  <ActivityIndicator color={Colors.surface} size="small" />
                ) : (
                  <Text style={styles.analyzeLabel}>Analyze</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Shutter button — center */}
          <TouchableOpacity
            style={[styles.shutter, !canCapture && styles.shutterDisabled]}
            onPress={handleCapture}
            disabled={!canCapture}
          />

          {/* Empty right slot for balance */}
          <View style={styles.analyzeSlot} />
        </View>

        {/* Loading state copy */}
        {analyzing && (
          <Text style={styles.analyzingCopy}>Squinting at your fridge…</Text>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  camera: {
    flex: 1,
  },

  // Permission screen
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    gap: Spacing[4],
  },
  permissionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.black,
    textAlign: 'center',
  },
  permissionBody: {
    color: Colors.textSecondary,
    fontSize: Typography.size.base,
    textAlign: 'center',
    lineHeight: Typography.size.base * Typography.leading.normal,
  },
  permissionButton: {
    backgroundColor: Colors.brand,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: Radius.full,
    marginTop: Spacing[2],
  },
  permissionButtonLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.size.base,
    fontWeight: Typography.weight.bold,
  },

  // Overlays
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingHorizontal: Spacing[4],
  },
  countBadge: {
    backgroundColor: Colors.overlay,
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[3],
    borderRadius: Radius.full,
  },
  countText: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },

  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Spacing[6],
    gap: Spacing[4],
  },

  // Thumbnails
  thumbnailScroll: {
    flexGrow: 0,
  },
  thumbnailRow: {
    paddingHorizontal: Spacing[4],
    gap: Spacing[2],
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeX: {
    color: Colors.textPrimary,
    fontSize: 9,
    fontWeight: Typography.weight.bold,
  },

  // Capture row
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[8],
  },
  analyzeSlot: {
    flex: 1,
    alignItems: 'center',
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Colors.textPrimary,
    borderWidth: 4,
    borderColor: Colors.overlay,
  },
  shutterDisabled: {
    opacity: 0.3,
  },
  analyzeButton: {
    backgroundColor: Colors.brand,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.full,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  analyzeLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },

  // Copy
  analyzingCopy: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing[4],
  },
});
