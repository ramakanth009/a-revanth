import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Menu, 
  Slider, 
  Chip, 
  Tooltip, 
  IconButton,
  Divider,
  Button,
  Collapse
} from '@mui/material';
import { 
  Info, 
  Tune, 
  Psychology, 
  Speed, 
  AutoAwesome,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SettingsMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 12,
    padding: theme.spacing(3),
    minWidth: 380,
    maxWidth: 420,
  },
}));

const SettingBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.secondary,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
}));

const SettingHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(1),
}));

const SettingTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const PresetChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.25),
  fontSize: '0.75rem',
  height: 24,
}));

const CreativitySettingsMenu = ({ 
  anchorEl, 
  open, 
  onClose, 
  temperature, 
  setTemperature,
  topP, 
  setTopP,
  topK, 
  setTopK 
}) => {
  const [showExplanations, setShowExplanations] = useState(false);

  const presets = {
    conservative: { temperature: 0.2, topP: 0.8, topK: 20 },
    balanced: { temperature: 0.7, topP: 0.95, topK: 40 },
    creative: { temperature: 0.9, topP: 0.98, topK: 80 }
  };

  const applyPreset = (preset) => {
    setTemperature(preset.temperature);
    setTopP(preset.topP);
    setTopK(preset.topK);
  };

  const getTemperatureLabel = (value) => {
    if (value <= 0.3) return 'Predictable';
    if (value <= 0.7) return 'Balanced';
    return 'Creative';
  };

  const getTopPLabel = (value) => {
    if (value <= 0.7) return 'Focused';
    if (value <= 0.9) return 'Balanced';
    return 'Diverse';
  };

  const getTopKLabel = (value) => {
    if (value <= 30) return 'Conservative';
    if (value <= 60) return 'Moderate';
    return 'Adventurous';
  };

  return (
    <SettingsMenu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Creativity Settings
        </Typography>
        <Button
          size="small"
          startIcon={showExplanations ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setShowExplanations(!showExplanations)}
          sx={{ fontSize: '0.75rem' }}
        >
          {showExplanations ? 'Hide' : 'Explain'}
        </Button>
      </Box>

      <Collapse in={showExplanations}>
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            These settings control how your AI character responds. Higher values = more creative and varied responses. Lower values = more consistent and predictable responses.
          </Typography>
        </Box>
      </Collapse>

      {/* Quick Presets */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
          Quick Presets:
        </Typography>
        <Box>
          <PresetChip 
            label="🎯 Conservative" 
            onClick={() => applyPreset(presets.conservative)}
            color="default"
            variant="outlined"
          />
          <PresetChip 
            label="⚖️ Balanced" 
            onClick={() => applyPreset(presets.balanced)}
            color="primary"
            variant="outlined"
          />
          <PresetChip 
            label="🎨 Creative" 
            onClick={() => applyPreset(presets.creative)}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Temperature Setting */}
      <SettingBox>
        <SettingHeader>
          <SettingTitle>
            <Psychology color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight="medium">
              Temperature
            </Typography>
            <Chip 
              label={getTemperatureLabel(temperature)} 
              size="small" 
              color="primary"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </SettingTitle>
          <Typography variant="caption" color="text.secondary">
            {temperature}
          </Typography>
        </SettingHeader>
        
        <Slider
          value={temperature}
          onChange={(_, value) => setTemperature(value)}
          min={0}
          max={1}
          step={0.1}
          size="small"
          marks={[
            { value: 0, label: '0.0' },
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1.0' }
          ]}
        />
        
        <Collapse in={showExplanations}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Controls response creativity. 0.0 = very predictable, 1.0 = highly creative and varied
          </Typography>
        </Collapse>
      </SettingBox>

      {/* Top P Setting */}
      <SettingBox>
        <SettingHeader>
          <SettingTitle>
            <AutoAwesome color="secondary" fontSize="small" />
            <Typography variant="body2" fontWeight="medium">
              Top P (Nucleus)
            </Typography>
            <Chip 
              label={getTopPLabel(topP)} 
              size="small" 
              color="secondary"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </SettingTitle>
          <Typography variant="caption" color="text.secondary">
            {topP}
          </Typography>
        </SettingHeader>
        
        <Slider
          value={topP}
          onChange={(_, value) => setTopP(value)}
          min={0}
          max={1}
          step={0.05}
          size="small"
          marks={[
            { value: 0, label: '0.0' },
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1.0' }
          ]}
        />
        
        <Collapse in={showExplanations}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Controls word choice diversity. 0.1 = focused vocabulary, 0.95+ = rich and varied language
          </Typography>
        </Collapse>
      </SettingBox>

      {/* Top K Setting */}
      <SettingBox>
        <SettingHeader>
          <SettingTitle>
            <Speed color="warning" fontSize="small" />
            <Typography variant="body2" fontWeight="medium">
              Top K (Vocabulary)
            </Typography>
            <Chip 
              label={getTopKLabel(topK)} 
              size="small" 
              color="warning"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </SettingTitle>
          <Typography variant="caption" color="text.secondary">
            {topK}
          </Typography>
        </SettingHeader>
        
        <Slider
          value={topK}
          onChange={(_, value) => setTopK(value)}
          min={1}
          max={100}
          step={1}
          size="small"
          marks={[
            { value: 1, label: '1' },
            { value: 50, label: '50' },
            { value: 100, label: '100' }
          ]}
        />
        
        <Collapse in={showExplanations}>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Limits vocabulary choices. Low = safe words, High = adventurous vocabulary
          </Typography>
        </Collapse>
      </SettingBox>

      {/* Current Combination Effect */}
      <Box sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="caption" fontWeight="medium" color="text.secondary">
          Current Style: {getCurrentStyle()}
        </Typography>
      </Box>
    </SettingsMenu>
  );

  function getCurrentStyle() {
    const tempScore = temperature;
    const diversity = (topP + topK/100) / 2;
    const overall = (tempScore + diversity) / 2;
    
    if (overall <= 0.4) return "📚 Academic & Precise";
    if (overall <= 0.6) return "💬 Conversational & Balanced";
    if (overall <= 0.8) return "🎭 Expressive & Engaging";
    return "🌟 Highly Creative & Unpredictable";
  }
};

export default CreativitySettingsMenu;