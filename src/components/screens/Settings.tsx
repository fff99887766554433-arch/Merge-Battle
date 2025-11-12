import { useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "../IconButton";
import { NeonButton } from "../NeonButton";
import { ArrowLeft, Volume2, VolumeX, Music, Bell, Palette, Smartphone, Trash2, HelpCircle, Shield } from "lucide-react";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

interface SettingsProps {
  onNavigate: (screen: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [neonTheme, setNeonTheme] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [soundVolume, setSoundVolume] = useState([80]);
  const [musicVolume, setMusicVolume] = useState([60]);
  
  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <IconButton
          icon={<ArrowLeft size={24} />}
          onClick={() => onNavigate("menu")}
        />
        <h2 className="text-2xl font-bold text-[#00FFFF] text-glow-cyan">SETTINGS</h2>
        <div className="w-12" /> {/* Spacer */}
      </div>
      
      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Audio Section */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Volume2 size={20} className="text-[#00FFFF]" />
            Audio
          </h3>
          
          <div className="space-y-6">
            {/* Sound Effects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  Sound Effects
                </Label>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              {soundEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="pl-6"
                >
                  <Slider
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-[#B8B8B8] mt-1">{soundVolume[0]}%</p>
                </motion.div>
              )}
            </div>
            
            {/* Music */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Music size={18} />
                  Music
                </Label>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={setMusicEnabled}
                />
              </div>
              {musicEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="pl-6"
                >
                  <Slider
                    value={musicVolume}
                    onValueChange={setMusicVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-[#B8B8B8] mt-1">{musicVolume[0]}%</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
        
        {/* Appearance Section */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette size={20} className="text-[#FF00FF]" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Neon Glow Theme</Label>
                <p className="text-xs text-[#B8B8B8]">Enhanced visual effects</p>
              </div>
              <Switch
                checked={neonTheme}
                onCheckedChange={setNeonTheme}
              />
            </div>
            
            {/* Theme Preview */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setNeonTheme(true)}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${neonTheme 
                    ? "border-[#00FFFF] bg-gradient-to-br from-[#00FFFF]/20 to-[#A100FF]/20 shadow-[0_0_20px_rgba(0,255,255,0.3)]" 
                    : "border-white/20 bg-white/5"
                  }
                `}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#A100FF] shadow-[0_0_15px_rgba(0,255,255,0.5)] mx-auto mb-2" />
                <p className="text-xs font-bold">Neon</p>
              </button>
              
              <button
                onClick={() => setNeonTheme(false)}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${!neonTheme 
                    ? "border-[#00FFFF] bg-gradient-to-br from-[#00FFFF]/20 to-[#A100FF]/20 shadow-[0_0_20px_rgba(0,255,255,0.3)]" 
                    : "border-white/20 bg-white/5"
                  }
                `}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB6C1] to-[#DDA0DD] mx-auto mb-2" />
                <p className="text-xs font-bold">Classic</p>
              </button>
            </div>
          </div>
        </motion.section>
        
        {/* Notifications Section */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell size={20} className="text-[#FFD700]" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-xs text-[#B8B8B8]">Daily rewards & challenges</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </motion.section>
        
        {/* Accessibility Section */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Smartphone size={20} className="text-[#00FF99]" />
            Accessibility
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Haptic Feedback</Label>
                <p className="text-xs text-[#B8B8B8]">Vibration on interactions</p>
              </div>
              <Switch
                checked={hapticFeedback}
                onCheckedChange={setHapticFeedback}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Reduce Motion</Label>
                <p className="text-xs text-[#B8B8B8]">Minimize animations</p>
              </div>
              <Switch
                checked={reduceMotion}
                onCheckedChange={setReduceMotion}
              />
            </div>
          </div>
        </motion.section>
        
        {/* Data & Privacy */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-[#A100FF]" />
            Data & Privacy
          </h3>
          
          <div className="space-y-3">
            <NeonButton variant="ghost" className="w-full justify-start">
              <Trash2 size={18} className="mr-2" />
              Clear Cache
            </NeonButton>
            <NeonButton variant="ghost" className="w-full justify-start text-[#FF6A00]">
              <Trash2 size={18} className="mr-2" />
              Reset All Data
            </NeonButton>
          </div>
        </motion.section>
        
        {/* Help & Support */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <HelpCircle size={20} className="text-[#00FFFF]" />
            Help & Support
          </h3>
          
          <div className="space-y-3">
            <button className="w-full text-left text-[#00FFFF] hover:underline text-sm">
              Tutorial & How to Play
            </button>
            <button className="w-full text-left text-[#00FFFF] hover:underline text-sm">
              Report a Bug
            </button>
            <button className="w-full text-left text-[#00FFFF] hover:underline text-sm">
              Contact Support
            </button>
          </div>
        </motion.section>
        
        {/* Game Info */}
        <motion.section
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#A100FF]/10 to-[#FF00FF]/10 rounded-2xl p-6 border border-[#A100FF]/30 mb-4"
        >
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#B8B8B8]">Version</span>
              <span className="font-bold">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B8B8B8]">Build</span>
              <span className="font-bold">2025.10.22</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#B8B8B8]">Device</span>
              <span className="font-bold">Mobile</span>
            </div>
            <div className="h-px bg-white/10 my-2" />
            <button className="text-[#00FFFF] hover:underline w-full text-left">Privacy Policy</button>
            <button className="text-[#00FFFF] hover:underline w-full text-left">Terms of Service</button>
            <button className="text-[#00FFFF] hover:underline w-full text-left">About Merge Battle</button>
            <div className="h-px bg-white/10 my-2" />
            <p className="text-xs text-[#6B6B6B] text-center">
              Made with 💜 by Merge Battle Team
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
