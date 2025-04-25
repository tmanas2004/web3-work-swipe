
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

interface FormState {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budgetMin: number;
  budgetMax: number;
  duration: string;
  location: 'remote' | 'onsite' | 'hybrid';
  immediate: boolean;
}

const PostJob = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIAssisted, setIsAIAssisted] = useState(true);
  const [skill, setSkill] = useState<string>('');
  
  const [form, setForm] = useState<FormState>({
    title: '',
    description: '',
    category: '',
    skills: [],
    budgetMin: 500,
    budgetMax: 2000,
    duration: '',
    location: 'remote',
    immediate: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = () => {
    if (skill && !form.skills.includes(skill)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkill('');
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!form.title || !form.description || !form.category || form.skills.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Job posted successfully!');
    // Redirect to dashboard or jobs list
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const generateWithAI = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setForm({
        title: 'Smart Contract Developer for NFT Marketplace',
        description: 'We need an experienced Solidity developer to help us build a new NFT marketplace with royalty features and multi-chain support. The ideal candidate will have experience with ERC-721 and ERC-1155 standards, as well as OpenZeppelin contracts. This is a 2-4 week project with possibility of extension.',
        category: 'Smart Contract Development',
        skills: ['Solidity', 'ERC-721', 'ERC-1155', 'OpenZeppelin'],
        budgetMin: 2000,
        budgetMax: 5000,
        duration: '2-4 weeks',
        location: 'remote',
        immediate: true,
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto pt-24 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
            <p className="text-gray-600">
              Create a smart contract job posting to find the perfect talent
            </p>
          </header>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Job Details</h2>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="ai-toggle" className="text-sm cursor-pointer">AI Assist</Label>
                <Switch
                  id="ai-toggle"
                  checked={isAIAssisted}
                  onCheckedChange={setIsAIAssisted}
                />
              </div>
            </div>

            {isAIAssisted && (
              <div className="mb-6 bg-web3-light/30 rounded-lg p-4">
                <Label htmlFor="ai-prompt" className="block text-sm font-medium mb-2">
                  Describe your job to our AI assistant
                </Label>
                <div className="flex gap-2">
                  <Textarea
                    id="ai-prompt"
                    placeholder="I need a smart contract developer familiar with Solidity who can build an NFT marketplace..."
                    className="resize-none"
                  />
                  <Button 
                    onClick={generateWithAI} 
                    disabled={isGenerating}
                    className="bg-web3-primary hover:bg-web3-secondary text-white"
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="block text-sm font-medium mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Smart Contract Developer"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="block text-sm font-medium mb-1">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Describe the job requirements, deliverables, and timeline..."
                    className="h-32 resize-none"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={form.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Smart Contract Development">Smart Contract Development</SelectItem>
                      <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                      <SelectItem value="Backend Development">Backend Development</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium mb-1">
                    Required Skills <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      placeholder="e.g. Solidity"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillAdd();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleSkillAdd}
                      className="bg-web3-primary hover:bg-web3-secondary text-white"
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="skill-tag flex items-center gap-1" 
                        onClick={() => handleSkillRemove(skill)}
                      >
                        {skill}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="budget" className="block text-sm font-medium mb-1">
                    Budget Range (USDC)
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        value={form.budgetMin}
                        onChange={(e) => setForm(prev => ({ ...prev, budgetMin: Number(e.target.value) }))}
                        min={0}
                      />
                      <span className="text-xs text-gray-500">Min</span>
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={form.budgetMax}
                        onChange={(e) => setForm(prev => ({ ...prev, budgetMax: Number(e.target.value) }))}
                        min={form.budgetMin}
                      />
                      <span className="text-xs text-gray-500">Max</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="duration" className="block text-sm font-medium mb-1">
                    Duration
                  </Label>
                  <Select 
                    value={form.duration} 
                    onValueChange={(value) => handleSelectChange('duration', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than 1 week">Less than 1 week</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </Label>
                  <Select 
                    value={form.location} 
                    onValueChange={(value: 'remote' | 'onsite' | 'hybrid') => handleSelectChange('location', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center">
                  <Switch
                    id="immediate"
                    checked={form.immediate}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, immediate: checked }))}
                  />
                  <Label htmlFor="immediate" className="ml-2 text-sm">
                    Immediate start required
                  </Label>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  type="submit" 
                  className="w-full bg-web3-primary hover:bg-web3-secondary text-white"
                >
                  Create Job & Generate Smart Contract
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
