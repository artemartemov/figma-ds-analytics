// Design System Coverage Plugin
// Calculates component and variable adoption metrics

interface LibraryBreakdown {
  name: string;
  count: number;
  percentage: number;
}

interface OrphanDetail {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  category: 'colors' | 'typography' | 'spacing' | 'radius';
  properties: string[];
  values?: string[];
}

interface CoverageMetrics {
  componentCoverage: number;
  variableCoverage: number;
  stats: {
    totalNodes: number;
    libraryInstances: number;
    localInstances: number;
    nodesWithVariables: number;
    nodesWithCustomStyles: number;
  };
  libraryBreakdown: LibraryBreakdown[];
  variableBreakdown: LibraryBreakdown[];
  hardcodedValues: {
    colors: number;
    typography: number;
    spacing: number;
    radius: number;
    totalHardcoded: number;
    totalOpportunities: number;
    details: OrphanDetail[];
  };
}

interface CollectionMapping {
  collectionKey: string;
  collectionName: string;
  libraryName: string;
}

interface DetectedCollection {
  key: string;
  name: string;
  remote: boolean;
  variableCount: number;
}

interface TeamLibrary {
  key: string;
  name: string;
  enabled: boolean;
  hasVariables?: boolean;
  hasComponents?: boolean;
}

// ========================================
// CONFIGURATION: Component Key Mapping
// ========================================
// This mapping is populated by running the Library Scanner plugin
// in each library file and pasting the output into library-mapping.ts
// Then rebuild with: npm run build

// Import the mapping (will be populated after scanning libraries)
// For now, use inline mapping - you'll update this after running the scanner
const COMPONENT_KEY_TO_LIBRARY: { [key: string]: string } = {
  '0281a7358c5a6923d53f6063eb4b849481ebe67e': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=false
  '358e6049a399020bcd6bab313a33f366709aa9f9': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=false
  '9fbd60dce25304c2248605d5602e92a8535fd62c': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=false
  'f1ea16cb8c832a837c60d2e1e282c01875fcaeb5': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=false
  '97178b7176bc9811828cc2f81f4cf53f9c307ac8': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=false
  'b1066a10b91efd8b1ecd6778c53794c34fea33c4': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=false
  '36c36a6d670a889424212466fedb58880465fbcb': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=false
  'a354d27aaf3513dc3c3f0f91e8864965276c4fa9': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=false
  '62c7669ccfb88b9872e39d8b0812378f573b2c4e': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=false
  '8b5fb61ff3ea1e72ae67eec9cc71064571c0b327': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=false
  '09cc5a22ecc4999103166d145012801862437168': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=false
  '4ba6cba2ec86414d071ece168d706f3da5caad1d': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=false
  'e724b3314e1ea2534d5e4773459f25c3a47748c7': 'Spandex - Atomic Components',  // Type=Club, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=false
  '3435264594df05165c40b1bdadc77d4948578f9e': 'Spandex - Atomic Components',  // Type=Club, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=false
  'af5c625865e1f51bad4be20adb17ad2fd5bdcb7c': 'Spandex - Atomic Components',  // Type=Club, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=false
  '7a28d9830564183f7e89c20a9411c9937537839d': 'Spandex - Atomic Components',  // Type=Club, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=false
  'f356f7736434e9a9a6d0a7fc350486ee83e2d25a': 'Spandex - Atomic Components',  // Type=Club, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=false
  '5061ca2e3c53b456a4aaecb6c23b1159f5004369': 'Spandex - Atomic Components',  // Type=Club, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=false
  '65fbcfb2b1f2b17415df9dc4e4f19877bd470bd2': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=false
  'c109dc66bd853684cc184ddf1be780b1bdb61b5c': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=false
  '2f1180216aafb1a1d840299078812dbe14f544ac': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=false
  'c35cf4d54fccbee5c21f690270e9c65603feba63': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=false
  '016ed9057074c24a661b9029e2f47508546baece': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=false
  'cb781cf761b117c26a6bf6f00f866ca60922da26': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=false
  '76345e7e6734558dc8d2b5b0765a9af58a2bb506': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=false
  'c119b950cd1c60405d16ac55e81397dd2e20f0f2': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=false
  'a0994f97b980af73e6e7ba24fd9b4560d2cc84c8': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=false
  'feb091e0c7b973d3aa32e547c16e21372052a969': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=false
  'f86b7bdc0ca6df90a2cef856e250eeedfe475e59': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=false
  '4609c518a0042a782a0248651429b271c95995ad': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=false
  'a223fd1642c4c552c22415cebe6a5c9d2d6625c0': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=false
  '916466b4485c16e2354e899f3aff16ac17cfc9ca': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=false
  '420495a876c9f86c66d2d006ead7c6b22e2c1092': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=false
  '2442a8d3575cd477499278a31121960643bcf4c9': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=false
  'c006110c1410de61aff93666fb567face63ffdac': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=false
  'e4d955204e965495730695945bf1fe9229e4914d': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=false
  '3ffdb044249703823a7574daf1caa87c35e065eb': 'Spandex - Atomic Components',  // Type=Club, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=false
  'e1691abd6bc0946553070a8efb07c84f134549de': 'Spandex - Atomic Components',  // Type=Club, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=false
  'fa6846a1cb2dab594783608d06d0a222b9f7e24c': 'Spandex - Atomic Components',  // Type=Club, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=false
  '26074306735df87c45e7e95a59fa4e36b410b348': 'Spandex - Atomic Components',  // Type=Club, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=false
  '244753276b3c9ea1e7bc071a8d594b8952cdefb5': 'Spandex - Atomic Components',  // Type=Club, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=false
  '529525a83f2c6d7996105aa811bcfcffbc048c3b': 'Spandex - Atomic Components',  // Type=Club, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=false
  'abb0d492ae32eab4331b8af97647b51289ba7d70': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=false
  'b4e03f186ba0636db99e19c65c589f4813e0d53c': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=false
  'c2e0eedcde722e40fea84c59a74eae46f6a147e5': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=false
  '6f855dc548cbe0d6f4a98ad11a0fc5158ee45173': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=false
  '07bde04aa68bd097fe928611c1141c0586751b9f': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=false
  '291d94facec1df7909dbcf899be32b73d0af30a2': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=false
  '065c7226e7970b351120be3e594b5fc035ac4e7d': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=true
  'cae374b042ed70774b510b16edfed6c78fcae957': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=true
  'c7be5ca7bf7111e70c08fe5736b103d91601dbc3': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=true
  '859524461983db398c3ea3566eb4b18987976961': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=true
  '53640e7001ef71aafe590b50290ec9dce6913dfa': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=true
  '946c6f97143248a84742bdca7d7b88c42cadf8a8': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=true
  '56c8460e6daa2e6a2b415fb720d12d535b865447': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=true
  '04b8f0a5b492c71e2e5679a100aa1e2228a6aa58': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=true
  '8ab91a3c28d647deecbe23d86c67a8518bfb1f2b': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=true
  '5561b683c8a9e34fa5ea6efd603564f228444bcf': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=true
  '37d9f8ce3c9e07c7d2872dc98b290cb82ad34fef': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=true
  'cad41caaa8d5dcb4c9cb0a176bccbbc176e04f48': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=true
  'f9626527b2a0b358705ed8ff4f494ee26e8996ea': 'Spandex - Atomic Components',  // Type=Club, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=true
  '64da5cdde3bcff42f37860f9868e1a2c01c8f137': 'Spandex - Atomic Components',  // Type=Club, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=true
  'da87d77e4aeaa2f75ff4a2fc00789c4c24ce71ff': 'Spandex - Atomic Components',  // Type=Club, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=true
  'b14a16d2923fc60bb1c3fc97d108edb89c2926ec': 'Spandex - Atomic Components',  // Type=Club, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=true
  'e22be337b73eb686924edbfef3d25905523d6383': 'Spandex - Atomic Components',  // Type=Club, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=true
  '7493af61481ea401bd859a04faf12e601ed8563c': 'Spandex - Atomic Components',  // Type=Club, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=true
  '1adb82e33b03c8af68274db6c142fae743c303d2': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=false, hasShadow=true
  '711277447ec83215042b62ee4bef63aa93eec7aa': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=false, hasShadow=true
  'd145956a44b65051c5880c70599831df9b07e0de': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=false, hasShadow=true
  '580d89d376b42d78f353540678fa66b6b1e3b9f6': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=false, hasShadow=true
  '75a3d24a57ec126476286d7d0c585b8f0c321ee7': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=false, hasShadow=true
  '74bb13d1400d203a3750481f99a8c02fb7d8cf06': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=false, hasShadow=true
  '56f54dbda1ea7a0b3d1286681796fc305e2a0836': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=true
  '6b9ea7cac196c3e44596a50b8431ef4cbbeccbe8': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=true
  'bf83794c00fa4351e8a5471a2a36fe2c44b92a89': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=true
  'b92726baaee014a2102cef67326c48eb4243aa40': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=true
  'a42e11edc9c799c32605502ef668c761b74c5720': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=true
  'c8232931c455c498aef0186c869fa9dff3bb21d7': 'Spandex - Atomic Components',  // Type=Profile - Photo, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=true
  '0f86a54953e41ddde328edeafd2b7a1013c6d617': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=true
  'fc1f0bbacee03066eba69ef4d39ba6e92d2668c9': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=true
  '340b84ecf31def1491559cd4c2ebb3ed8c302e0d': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=true
  '9bbef9a5bf369ac8e786965f3a27fe7f23fb4ee0': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=true
  '072f902554ea2583b93e5163e4edbef7d858e8b6': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=true
  '4d868288f653827b5b50a50bff24f0d40dc728b5': 'Spandex - Atomic Components',  // Type=Profile - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=true
  '47bef11942002efb3f82fb52db51a99f24497788': 'Spandex - Atomic Components',  // Type=Club, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=true
  'fc189919dcf5f8fa76cbed6b10175774061bd2dd': 'Spandex - Atomic Components',  // Type=Club, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=true
  '70ad98d933a7be390e79ce69a953d5326330140c': 'Spandex - Atomic Components',  // Type=Club, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=true
  '4553cf97a098c4c66ee3214cf117507c6dd515fe': 'Spandex - Atomic Components',  // Type=Club, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=true
  '0d4dd77f1c4cfbf207f1c2bfef0874ee869dbb9e': 'Spandex - Atomic Components',  // Type=Club, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=true
  'fb4a9f945ee333ff974862c8acf027e8b0696ecb': 'Spandex - Atomic Components',  // Type=Club, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=true
  '31364227d499e2e55df1a2fd8e5e6cb8b158f666': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=3XL • 64px, isSubscriber=false, hasStroke=true, hasShadow=true
  '0d4b8e7119f9a44de97b5524b1e07f15e848c801': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=2XL • 48px, isSubscriber=false, hasStroke=true, hasShadow=true
  '5011e7adb996c703e3309811a8c051ab8cff7690': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=XL • 40px, isSubscriber=false, hasStroke=true, hasShadow=true
  '8b57a14545e940fb10b03c7537ab7e41f5c330e4': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Large • 32px, isSubscriber=false, hasStroke=true, hasShadow=true
  'd3ca6f4ac33a5b6148f5fa9b3941d358dc31315b': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Medium • 24px, isSubscriber=false, hasStroke=true, hasShadow=true
  'e542cb00e1a6de3aa557af3c5cb8a57fb110735a': 'Spandex - Atomic Components',  // Type=Club - Placeholder, Size=Small • 16px, isSubscriber=false, hasStroke=true, hasShadow=true
  '1063a2fc85689f38e151ff0f8b1cd11bcb6a5e81': 'Spandex - Atomic Components',  // ↳ isVerified=true, ↳ isSuperuser=false
  '4fb4a4bad79bd352786988e4ce65faab920cf292': 'Spandex - Atomic Components',  // ↳ isVerified=false, ↳ isSuperuser=true
  '65caee128c5b2a717191e1fbdcf665efa0d15e9c': 'Spandex - Atomic Components',  // isFree=true, isSubscriber=false, isClub=false
  '0e6496049ef73cf2a898e1e82a8266cca1946ab9': 'Spandex - Atomic Components',  // isFree=false, isSubscriber=true, isClub=false
  '4d0a0301a037af771d11631378bd592163fdb5e7': 'Spandex - Atomic Components',  // isFree=false, isSubscriber=false, isClub=true
  'e582e906e7e48ab9c7eec1fec750d5ca6eb86dd3': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=false, hasBorder=false, hasShadow=false
  '8b9f3cc7fb5c6da89e4a565e74798eb3dd95312b': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=false, hasShadow=false
  '0bd55b0c33e2e9d05d6e7ec774bbaa8741672c55': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=false, hasShadow=false
  'b51d3e84a59224cf05a84cd262071e01a0bf0738': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=false, hasShadow=false
  '6baef019d8f1c160ecd1dbedc107c2cffd880ec9': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=false, hasShadow=false
  '6e8ce5d8062c33c4f8e63715fd8e0e78383565d9': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=false, hasShadow=false
  'a6806bdf437c41ee12a93a248478fbc24efa5b1e': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=false, hasShadow=false
  'a5ad9822010c44dfb9cd7751c3d265f810456a65': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=true, hasBorder=false, hasShadow=false
  'a2f2588231807657bd6960b8068177940fde99f6': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=false, hasShadow=false
  '73b5fcb75de3ba028df992b441fd1667099a6cc2': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=false, hasShadow=false
  '20ef1905cbb134fe5c6b6980eb7eb61dbc76dfd3': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=false, hasShadow=false
  '6ba3b40461620f96e97e07124ddbd797b6d31d01': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=false, hasShadow=false
  '29bbd396d59e3e47456c4fce1664035c5734e68e': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=false, hasShadow=false
  'abc85e1342d51cbd7a5d8a5b2474c20a698b918e': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=false, hasShadow=false
  'fd28983ee8b864d13f9a241ef5fa46e6c5da2a1f': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '07ee839ef80236ad3e1b49f83a8c308b6c61082a': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=true, hasShadow=false
  'a0168bc0a94e673f81781fdc8a12343a2dc5ec35': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=true, hasShadow=false
  'a869d737bbdb0d97e42488880235e4cd9988aaf8': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=true, hasShadow=false
  '57ba0d7c487ae6fe68b381604fbf04c5b7bdaf18': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '2cadeb0902536cfb88090557e8681372be0f65cb': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '819eac318ec48dd638fda7d54d2afcb5aedcdfdb': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '52cb6c7e2b3c1a54a2be51948bbe6b5be45750b0': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'fc0ab6988886dc1743442a20d9fa8c52e4da6fbb': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'e0d346ecae25a380637d22c0adece7d47680bad5': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'f39d6669c4a1ce6071a8055dc98f9fcbab21182e': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=true, hasShadow=false
  'ae52a306ae8d139c5b00acc9157573c0de1c8827': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'da3411ca5106abc82c8cb4924a7db8b7cbf2f8f0': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'd8ef6aa81da7caffe362d7c2ad0943b1973199f6': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=true, hasShadow=false
  '30184dcc374fcd2c9476d341ce8c5c2a69d6a513': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'e74eac768b3430b40e71cb7464610b62bdb28f79': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=false, hasShadow=true
  '6dfdb726063f5cd929bec2e57ff40ca965df6d8d': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'c7311e0ad00ff04d3ecdf5c89be0f5c7f42f48e9': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=false, hasShadow=true
  '87e16e652d8dbf6f528a8b9b930ce3e0497ce696': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'e1a74ffc2b0a00b4f0b78a62639fc74cedf5705c': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=false, hasShadow=true
  '97c916ddc1ffe5bd03a949d82be7f101551c27d8': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'ddc7abbe8719894af7c861d59bd39ce5e6a17146': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'ecba4dd48861eeca237af9a5d3625dbee590e3da': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=false, hasShadow=true
  '57db94f00b737cd90d8db778930dcbf5c9be1de7': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=false, hasShadow=true
  '1d0edaffe902492dca6d2e836fd9aa3c909f97aa': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=false, hasShadow=true
  '914f62efdebf1aaf7983e879cb0d9a10766bf389': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=false, hasShadow=true
  '79ee2500d4436bb341347bc76d3caf3339c263d1': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'd0b6071f14c5daa2e39044ca12062979a4bd2aa2': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=false, hasShadow=true
  '1b7374d6584b40dceb0c4e78019c69f760728673': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=false, hasBorder=true, hasShadow=true
  'e227c4610ef2e0f7e0bd72ab558bc652c6680365': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=true, hasShadow=true
  '397e6a9defb634ccbfef4c9c68f2c16264f46b80': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=true, hasShadow=true
  '6f6b0bf53f6d2515cc538b006f5cef9dbbf4367a': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=true, hasShadow=true
  'ba5b115fc6afbe8a81dd358c54f5a522e75181bd': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=true, hasShadow=true
  '074c3ab30710f86408111993093ad5020a56f87c': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=true, hasShadow=true
  'fca6ea1c8f48a1af0096ee72664e21a2a10b827c': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=true, hasShadow=true
  '53c07451723a12d048fd31871c3530e029d37a1c': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=true, hasBorder=true, hasShadow=true
  'd2c87b7d68f8dd1f97b78453c5c189ce2ce22951': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=true, hasShadow=true
  '93c9a65b537977d0307c9fa8a620a015aad172d9': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=true, hasShadow=true
  '2ef72b8226fc184bb4e01f831555fb702c352887': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=true, hasShadow=true
  '07065dc004041f41e154ea08e2bf772bb11e4aa1': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=true, hasShadow=true
  'ba5cf08f5df7a1afe8fa6526e69fa453f3810778': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=true, hasShadow=true
  '53708c9b1ce949999b2d7e3465d53350f4ede4be': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=true, hasShadow=true
  '387f0720408dfb21c248188459132f1622bd7901': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=false, hasShadow=false
  '5060de37f91800440d135f3f0c260d2b22b1f921': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=false, hasShadow=false
  '5beaee11f8f694eff7a53716dcb7f4de9e5d8cee': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=false, hasShadow=false
  'beae2d7daea708958e6a6487e72a8ac928702a05': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=false, hasShadow=false
  'a9f372d6c9fdbde9398271bc1c10512412e5e81a': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=false, hasShadow=false
  'cdd3683c8f6a28d7f62484d7d6bfd370e4389c57': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=false, hasShadow=false
  '9d2b1ab96ebb503b805816559d972e6693121efe': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=false, hasShadow=false
  'c89c0ee4a1b2b4330d8b0eb7b735c972fb6a510a': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=false, hasShadow=false
  '9de340caba3ead9caaa0f7981c797984c7babef8': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=false, hasShadow=false
  '42e389a0c65aa38ff8983e31a503a41bd17e2ff6': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=false, hasShadow=false
  '9f13e05f5d0b1f9efb74692275e84db4c02bf499': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=false, hasShadow=false
  'dd20b8bb0b346f322318421f7ca681a013e7550c': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=false, hasShadow=false
  '9b6e4cb25f76f68e5c35663d7d7a9b0e4ebbdbd7': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '44be718a99de9d6829695e64d9e07d3c987af868': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=true, hasShadow=false
  'a3944891bfa1f6e15bc8414efab064936df01e5f': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=true, hasShadow=false
  '3e90cfb6f49dc11336fa538adb18c635469cfe18': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '2f65f04cf0c89f3b88909179253d38f0133c39e4': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '002ebc4999e4cb913ff8dea1e7326d853fcf04e3': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=true, hasShadow=false
  '8ad949b5d8238987000b374e2f66df3bb194ac20': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=true, hasShadow=false
  '9248dae66e48f69fecde8e552264dd69f29aa09f': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=true, hasShadow=false
  '6d7a8d29c229eb53c218e9201c5fa1ef4b0d093d': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=true, hasShadow=false
  '139f2c460598b4380e7de08f498122b2580335c0': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'f0ae30ecdf8e81ac2c94a233d09bcdf2e1d6223a': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=true, hasShadow=false
  '2e09fb99e0a70fe93be9ee77507caae0ab7f4e14': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=true, hasShadow=false
  'd99cf4c221437708186d4e2076f2d4b7935a7907': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'b5f272eefcf66a166412185102bca6684bc5e3eb': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=false, hasShadow=true
  '4c7186c69c0ee5f9fae4c6a52230d774d880d9e8': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=false, hasShadow=true
  'f142b18462c64fd6a43cb61bbddb979487cb7b09': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'b1467e8e5be8ac0789cce34747cd4a118544c78c': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=false, hasShadow=true
  '781f5d8a2475f71865c9a1fdb7ff41b2cfb7e4e1': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=false, hasShadow=true
  'f100f0afd02ca567ed9447d971471cf826910f53': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'b06adcb9c62137c277bff67f6a6beea124f3fb7c': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'f919b206d381d62db3a05e24d0326fbd5944be42': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=false, hasShadow=true
  '4a0eca2fc9c0508752c7e8691120eec82c082f61': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'e9b6cb562360437db11c9a2c15a59db9103c54b6': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'd3365657ae7d90c837bce7f424bdd6f45bc4c40c': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=false, hasShadow=true
  'e9169579a4fd9763cec668ffb464c6d04e558992': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false, hasBorder=true, hasShadow=true
  '03c18504aa6d5d7f86037d222ed93a4f4111237e': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false, hasBorder=true, hasShadow=true
  'ab5b5947a805803f4acde5977e94b5691718a09d': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false, hasBorder=true, hasShadow=true
  'ac35a03cc8a507e40b2c636204f5cc896dc37fc7': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false, hasBorder=true, hasShadow=true
  '1ca9d10e240cce484f00628fe7c38e1edf510e08': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false, hasBorder=true, hasShadow=true
  'cf7b1a94d67b2b5217079d7d51897d1970ead42b': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false, hasBorder=true, hasShadow=true
  'bfdf459d211b31fec94fbe314186de247eb1987b': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true, hasBorder=true, hasShadow=true
  'ee2611f650c95c8c89c4238bfd24d2680b56cad9': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true, hasBorder=true, hasShadow=true
  'c15689ecf911fa7d1fa01c71b1003c2bf0dc4502': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true, hasBorder=true, hasShadow=true
  '015a778b023fe32a388011eb447a3a850209750c': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true, hasBorder=true, hasShadow=true
  '712a3e4956afc059bd26a0c9006fc4ec50470776': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true, hasBorder=true, hasShadow=true
  '396260228e7c4eea4e5486f135a12cb3957cbb8c': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true, hasBorder=true, hasShadow=true
  'ff89f6383af3fd735a6f2c0306d0db6849446007': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=false
  '201ad5955191a3cdab694fdf08febe04a8ad7b7f': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=false
  '16f63a9688e323fcb8b3f0ac00578a387072fb54': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=false
  '840ebebe9d97774257a6f1998f76309331316a6f': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=false
  'd32a202694d2b6d7e2e72f4fa8d85a1da9894b9e': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=false
  '1e3fe852746956c1f6a97a445578286b80f08dcd': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=false
  'ac8943f03169edd2c9cbf14783042024d578b906': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=false
  'ffe63a79f4cc85f5f46c85ed28b23d4da86d56f0': 'Spandex - Atomic Components',  // size=4XL • 80px, isPlaceholder=true
  '5bad887a2cb9ae790a9f6b0702d5aeff020c6e49': 'Spandex - Atomic Components',  // size=3XL • 64px, isPlaceholder=true
  '1f59dc11cc8981a9c8d72bb3c741c9495cd78bd4': 'Spandex - Atomic Components',  // size=2XL • 48px, isPlaceholder=true
  '60e87b181d9366622be6decfc4806ab0ee93632b': 'Spandex - Atomic Components',  // size=XL • 40px *, isPlaceholder=true
  'efafae9d312cef6f77334eb7da7e7cfa043ea7d7': 'Spandex - Atomic Components',  // size=Large • 32px, isPlaceholder=true
  '9105e147759ebfbcdb22f7159658245d7b7d25fa': 'Spandex - Atomic Components',  // size=Medium • 24px, isPlaceholder=true
  '32226e2d68d8f04f3dae3e4dd3bf5e35236957ab': 'Spandex - Atomic Components',  // size=Small • 16px, isPlaceholder=true
  'fc3fc78f3f1ab54d0bead2f6fe81697e03f4c2e4': 'Spandex - Atomic Components',  // ↳ isVerified=true, ↳ isSuperuser=false
  'c115dbbcb760a598a1283b371e94b38bbc6d8ecc': 'Spandex - Atomic Components',  // ↳ isVerified=false, ↳ isSuperuser=true
  '26c52f26c53545fb53e670d635ab9c165422abba': 'Spandex - Atomic Components',  // size=2xl• 24px, isLoading=false
  '4b38bce13de23e5c2d3ae8e5e0399fa55ec0863c': 'Spandex - Atomic Components',  // size=xl• 18px, isLoading=false
  'db2532c1f105cee5d21d52c7014ac212dcac5408': 'Spandex - Atomic Components',  // size=lg • 14px, isLoading=false
  '2e907839ebeb74cd85b79262069992cd8b28842b': 'Spandex - Atomic Components',  // size=md • 10px, isLoading=false
  'b0d53426ea2b817aeae88d0ab89816fcdb9dc6fe': 'Spandex - Atomic Components',  // size=sm • 8px, isLoading=false
  '77c69257e41fcfb628b8c4fed083bfe3a7738e70': 'Spandex - Atomic Components',  // size=xs • 6px, isLoading=false
  '81712c9d349608e2b9c8f74def5c6e036bb19fac': 'Spandex - Atomic Components',  // size=2xl• 24px, isLoading=true
  '111f28916868bfc873229794959a1fd62807537a': 'Spandex - Atomic Components',  // size=xl• 18px, isLoading=true
  '9b19d9731e4e4f727a046e7f04030e9159b7e435': 'Spandex - Atomic Components',  // size=lg • 14px, isLoading=true
  '10df660a40a8f5b1519a185218485ec4a1473940': 'Spandex - Atomic Components',  // size=md • 10px, isLoading=true
  'd1bb7dd8c1f5f6965fbb17bfce2bc2ddfb708d9d': 'Spandex - Atomic Components',  // size=sm • 8px, isLoading=true
  '4e5f58f173c1488d4b66510cc691a51a4ba65f57': 'Spandex - Atomic Components',  // size=xs • 6px, isLoading=true
  'b17cee5d88ae67cd6df60f1704561c279c917fd5': 'Spandex - Atomic Components',  // _statusBadge
  'ec5eb1562cac21c1fff7f76609a2f24affd0a107': 'Spandex - Atomic Components',  // _Avatar-AccountIcon/false/true/false/false
  '6d3309eb2a7f735ca042fe3570c89985546b1015': 'Spandex - Atomic Components',  // _Avatar-AccountIcon/false/false/false/true
  '35ea0ae1660517ccf3b59b1c77dc2e4edd542965': 'Spandex - Atomic Components',  // Type=Count
  '004bd20df78eba91f3b47e64db438bab789e543d': 'Spandex - Atomic Components',  // Type=Dot
  '63ae8a263d791bc22f109ea6e76faf49334948a2': 'Spandex - Atomic Components',  // Size=Large
  'fa6187f5ba9fb44898bbdb1ef76655d183bae028': 'Spandex - Atomic Components',  // Size=Small
  'b74e0939994ae4162eb598d269281b99684997d9': 'Spandex - Atomic Components',  // isError=true, isSuccess=false, isInfo=false, isWarning=false, isStrava=false
  '3b5a57d88725ad86f7e83980a4f6a982a73dde9f': 'Spandex - Atomic Components',  // isError=false, isSuccess=true, isInfo=false, isWarning=false, isStrava=false
  '66fd46a73daf6427dd87f586653dc0c4a882d622': 'Spandex - Atomic Components',  // isError=false, isSuccess=false, isInfo=true, isWarning=false, isStrava=false
  '18a2696fa3bf694acc006d6f6b47e16bbf590fd5': 'Spandex - Atomic Components',  // isError=false, isSuccess=false, isInfo=false, isWarning=true, isStrava=false
  'aa3bc473158196f440528f0d411cb185b1343be7': 'Spandex - Atomic Components',  // isError=false, isSuccess=false, isInfo=false, isWarning=false, isStrava=true
  'dd28f4c85fd3b6464db7351c1804fd309b84f22c': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary-Alt, isPressed=false, isDisabled=true, isLoading=false
  'c7d5c400669c15917a4fc0b23ce2c77c1c2d2571': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=false, isDisabled=true, isLoading=false
  '53a294ab0dc2f42e16354b4af7a710552f317c76': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary-Alt, isPressed=false, isDisabled=true, isLoading=false
  '71f78acc6a08b3e0bb9ac3687087aef6458845ff': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary, isPressed=false, isDisabled=true, isLoading=false
  '4e16fb52b5d72a1e5a11649d2a98b647099f9f6e': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary-Alt, isPressed=false, isDisabled=true, isLoading=false
  '094e9cea52900dccaa7f9575b551b836a57f3473': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=false, isDisabled=true, isLoading=false
  '0265e06bd4f8638705b5f0c839be58453ad0b2aa': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary-Alt, isPressed=false, isDisabled=true, isLoading=false
  '4189729c9d4f60791043ea5cb9df684eab5cec0f': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=false, isDisabled=true, isLoading=false
  '4f5d6f7c789a481bc5f9efecb6f2e614858a4efd': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=false
  '955d52ac17ef87e9159480f53391a9ab9c5e7f48': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=true
  'f2de7629c170cfb43acfa1f02ae16d5917cb73c8': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=true
  '78bb93bb5f0562316918c6fe9bfc557b652cb62d': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=false
  '4a7cdde47cdac77a497c191c12a5ad0d96c1bddc': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Destructive, isPressed=true, isDisabled=false, isLoading=false
  'f70389f1223fcdd2b8653505e1c2e675aa9c733c': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary*, isPressed=true, isDisabled=false, isLoading=false
  '50e3700e55f7b6dc58a792b2ffa7e4c56ed9c38d': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=false
  '3be53ddae4c7676636459ab937be221bff80378c': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=true
  'cd5fb00a93e6a8bfabc91f1bab75a64b016a1065': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=true
  '628de856c6d6c5d62e9edb1eaa3ad7b306f238c6': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=false
  '041dfd447edbb5ed5dace079ca6ae9da1a2b4a4f': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Destructive, isPressed=true, isDisabled=false, isLoading=false
  '288ed12266222c152f7895437e7de4144a947d86': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary*, isPressed=false, isDisabled=true, isLoading=false
  '362ac8ea59893c8d641debf6d947c4760891fb23': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Destructive, isPressed=false, isDisabled=true, isLoading=false
  '1dddbd9a4bec8bc69e1186fd8d7e5c986200ad36': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=false
  '6d7ec99d4f0654e2a5bddc24e5b7429653f929dc': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=true
  '000b6207da0b47803e2e2f6e29757b28347fa865': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=true
  'e92e80800d936bee0d745d0f6c0ff1651e88c239': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=false
  'f8ffdb3b659b9f7c9a8aa4f3cd6affdbf4392b9f': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Destructive, isPressed=true, isDisabled=false, isLoading=false
  '4e8d850fd5fadc26e6a9fbd355bbc27765dc9040': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=false
  'fa5406279265cd4620152bc170a744a685e24204': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary*, isPressed=false, isDisabled=false, isLoading=true
  'b83a7db4a1d03049d3ce025cd4ca12f96eb66f81': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=true
  'be5dca1725abfe2756c67e62ea18c5f2739d087e': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Destructive, isPressed=false, isDisabled=false, isLoading=false
  '5e30e46c2bcdf50760e36389bf7a1d45af11b334': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Destructive, isPressed=true, isDisabled=false, isLoading=false
  'e36075be374cad56d87d662795804e916e6a7453': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Primary*, isPressed=true, isDisabled=false, isLoading=false
  'a26cec9dd606ef67292fa87869e5bf7c2973e476': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Primary*, isPressed=false, isDisabled=true, isLoading=false
  '4e488f689b46e1d8e2b9c01e12684e5cee63af6a': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Destructive, isPressed=false, isDisabled=true, isLoading=false
  'f75ee5c47e8f13621c3dfb8fe13aa0cab2487b02': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary*, isPressed=true, isDisabled=false, isLoading=false
  '9b935fded151777f2cf44b39b87d5ad5f5949e02': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary*, isPressed=false, isDisabled=true, isLoading=false
  '7fe80474c43f8f2c4850283901bd3d0f467daf80': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Destructive, isPressed=false, isDisabled=true, isLoading=false
  '2c40df035bff0e9f6c4568ec486d1dacfc25a210': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary*, isPressed=true, isDisabled=false, isLoading=false
  'e5228601687342cade29becf17f7a54c8175df68': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary*, isPressed=false, isDisabled=true, isLoading=false
  '1c3656a086aaff10f7f2650abb2b264f41e92d01': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Destructive, isPressed=false, isDisabled=true, isLoading=false
  '47bcf8434aa7704204c5a4f53ef95e2bf4ee7a86': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=false
  '0545645b72588071dbbc087f802ca2d7cad08a62': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=true
  '77235f2afffa555e68f7afe2ae33368885ce1bb5': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=false
  'cca00ea4e63164d1858b674399c2022e1dfa78c7': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=true
  '65daa6fcbb32d0d85a3216b0757f230735fb658f': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary-Alt, isPressed=true, isDisabled=false, isLoading=false
  'afb40a0d4c83fc74de24ffc2fc29b2491c0a6860': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=false
  '7fd9eb95bb5966ab9f561118b21a31d2a206919d': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=true
  '1f3685611949ca5772aecc56924b35211c46a687': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=false
  '2acf0b43e2f0ecb030cdb5bf658a69937050daf7': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=true
  '6bc1a62c990769d08f37bc927cd6531a6e0bad9d': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary-Alt, isPressed=true, isDisabled=false, isLoading=false
  '1d5cd014d6129040fc4e8e4da8df63fb7f3fa9ab': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=true, isDisabled=false, isLoading=false
  '2886fc51387bf1dcaaf0453e6bd6f1cd73ec7f40': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=false
  '8d75e65350e8eb16f7b59f11fe532949d51fbaad': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=true
  '3f5658d65f8c4de9bfa52c71384361111b542e1a': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=false
  '4ec9b29956f3b570f57ed7401b23eb6e248e7e96': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=true
  '73eb8a667b2d1f916a4ce4591ca2dd07ac43cf8d': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary-Alt, isPressed=true, isDisabled=false, isLoading=false
  'f159c331dd0280df28af4eb6aaf3e61f955be0b7': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=false
  '4d0e3ac3602d6d53c354622223b717d49b81a92f': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=false, isDisabled=false, isLoading=true
  '0cfa89981b9c39c2432110200673646a77ce8a6d': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=false
  'ac510baf1177ce3b1dbd1ccd47b6132ea3617bbc': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary-Alt, isPressed=false, isDisabled=false, isLoading=true
  'aef9664ccdb83fb6e5bf921d9512df5fc9ac1206': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary-Alt, isPressed=true, isDisabled=false, isLoading=false
  '116ce7ef51da762c391245dad21eb5f696d2da1c': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Secondary, isPressed=true, isDisabled=false, isLoading=false
  'ed0363e2ce6c320fb8dd9d43208ee81249dcbf2b': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=true, isDisabled=false, isLoading=false
  'd0ac6791825fb574226cbb018e337e738090ebe1': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=true, isDisabled=false, isLoading=false
  '23e0c4ba6b7a6dca4f3674b19dc1bc2935bdc0c2': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=false
  '6e289fcfeec5655bf418f9d7151e2b8a8376c69b': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=true
  '311a84b7f078dab4e584c6ad7dfaacd725ce3e61': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=true, isDisabled=false, isLoading=false
  'c94fe2004ef6a3308961a69fbe625742be4bf132': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=false, isDisabled=true, isLoading=false
  '884deea1cc9150d31a6626b52e0252040f64ef35': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=false
  '27f80f44587e84d97eae01b3a85c751757699c9f': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=true
  '64377d6332e70a0fd7cc3d9463e50c0fcab29591': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Tertiary, isPressed=true, isDisabled=false, isLoading=false
  '468190c7db246fef7595f09a392f04af1f09623b': 'Spandex - Atomic Components',  // Size=Medium*, Emphasis=Tertiary, isPressed=false, isDisabled=true, isLoading=false
  '86df311cdec5b2503626ce8be4782e83caac0ad0': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=false
  'b7a48a8f752b24635f83783ea5ce7a7235bfccde': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=true
  '8fa4a5c5f9e25cb6da914e45ad51bf632ad582ca': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=true, isDisabled=false, isLoading=false
  '64e9e1d636bf4e26dfb033440e2a2e9ea32c5edc': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=false, isDisabled=true, isLoading=false
  '326f8a8a24f80a30a1e68945e1a8f63afa9e3675': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=false
  'a07b7df345ae707504b5acdd4a5739a7ec838f2e': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=false, isDisabled=false, isLoading=true
  '7fef8ef6f27fe04240a92376b5cab3a64c47e8b4': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=true, isDisabled=false, isLoading=false
  '3a10287a04af0eaf9331c030faec621992c8a32a': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=false, isDisabled=true, isLoading=false
  '6f152085f5e16d2384e1e165cd867c8035fb8a0b': 'Spandex - Atomic Components',  // isLoading=false, isPressed=false
  '75d880cd38344ec4c6fd62380d964aa668a8cf1d': 'Spandex - Atomic Components',  // isLoading=true, isPressed=false
  '4d9fcb4a707a371ef78a1a9b25047e69edb222b8': 'Spandex - Atomic Components',  // isLoading=false, isPressed=true
  'ca41e8cde2a21f4545a933fa027996333df0990b': 'Spandex - Atomic Components',  // isLoading=true, isPressed=true
  '74fbe009515461152c6b1e9896cf5865bb8e1dcc': 'Spandex - Atomic Components',  // isLoading=false, isPressed=false
  'bf5e079cbb71aff69543ca34c8747a160be8463f': 'Spandex - Atomic Components',  // isLoading=true, isPressed=false
  '0609c93eb018ea72e283042dad6b92384e12b3ef': 'Spandex - Atomic Components',  // isLoading=false, isPressed=true
  '9ed86b6242c505c05815aee1649de4bcec44386a': 'Spandex - Atomic Components',  // isLoading=true, isPressed=true
  '6e245053147dd4495674432eaf6a6a53ed4d64c9': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Disabled, Floating=False, Content=Text
  'ef1e357c4325534c9b8aa6a6271956acec6e991e': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Text
  '45ae73901a594fb62c1b41ced8b646586a3b97e8': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Enabled, Floating=False, Content=Text
  '606e409a1b86eb81dbe13826e050b07ff1088e6e': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Disabled, Floating=False, Content=Text
  'b4dce577f6844e9ae8ef4cb82d37512b0c49d660': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Text
  'acd7ff3b9c96317a7dd9b7e4294d3a53a7c9622d': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Enabled, Floating=False, Content=Text
  'a249de954a2102358ccc9d087ff94b3194c16a2e': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Disabled, Floating=False, Content=Text
  '59a69306c27aa43bd346b5b95065b57aadab65c6': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Text
  '8eb09b7b17591512b9a26d3cb081946b4bd977c1': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Enabled, Floating=False, Content=Text
  '852857d1ba5f1428d45b722d3f67cdf718446bc8': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Disabled, Floating=True, Content=Text
  '95cc6ad218c8ba21cbe251a9a36ef01b750d5079': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Text
  '1688b5bd3c07279ee2b973c3bead358c01b8ad3b': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Enabled, Floating=True, Content=Text
  'd73cb9aa7ff3a0f4e3de4e1876dd35bc6dfc5b8f': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Disabled, Floating=True, Content=Text
  'c4ab005e5f3d4fec93a4ba68a8e3a22c9510c317': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Text
  '905cfa63aaa89060064f0bd60243ca56c2c3266b': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Enabled, Floating=True, Content=Text
  '47cff8f6010888c13f652f683fb8437d7c1a5f7f': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Disabled, Floating=True, Content=Text
  '3b1702e2d4bb47fec6d2978e967644c256c03fa1': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Text
  'e38c2f159f2404f4d94cd0186b08b6efe07d478e': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Enabled, Floating=True, Content=Text
  '9b06ff96e5822466edf3a2810b750041e82ba880': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Disabled, Floating=False, Content=Text
  '5946886eaefee92652b189d1b56b2620a4c64f6e': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Text
  'd62cef1fea4e472974102e5f92340385c1ed76da': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Enabled, Floating=False, Content=Text
  '5ce6115c9dcee3010d7864e9725ace6e30c8fc98': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Disabled, Floating=False, Content=Text
  'e62d62e4ab497469d4e5ab95d8b39eb408c5577b': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Text
  '1b80dd88caaa75640d18a0c3405847bb029ba2bb': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Enabled, Floating=False, Content=Text
  '4ca62b944bdfdd103906a3b5b4c17c779c22df7b': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Disabled, Floating=False, Content=Text
  '351da42cfb5200b5615bcea1df7cc4df00330549': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Text
  'fbb6a824e0224926f0090c8b92043be35881cb6a': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Enabled, Floating=False, Content=Text
  'dd2bc664e979f1d6d4dc48feaa04bdc912071468': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Disabled, Floating=True, Content=Text
  'bb67bc7eab0d4fe8a7be6fbfb3499a0b27e0b3d0': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Text
  'e07dc2643fe4056244bdc25344d405efbfe6dc90': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Enabled, Floating=True, Content=Text
  '0b4073a7680d97b70a8bbe6da2f1de20b0f536a1': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Disabled, Floating=True, Content=Text
  'c250d4d66110f71c984fd2d576f2ca24559888d4': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Text
  'ec832054d9ae000156d536884eff8ef8c1a610a4': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Enabled, Floating=True, Content=Text
  'ef220807350d56a56842299b2c0b120367184720': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Enabled, Floating=True, Content=Text
  '83457c260c3c40e4bc643569b629e24f0b584cc7': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Disabled, Floating=True, Content=Text
  '406bb30a7caafcbf52480970c3c1326bf3663310': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Text
  '2ab4d65d1dcfe3a4f425243bcabd6080f3477120': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Disabled, Floating=False, Content=Text
  '5cfa992e88d96d2790fb405a43fc839ed48febe1': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Text
  'c9e1c242d966dc498ff7e3f830a6071e3f8781a0': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Enabled, Floating=False, Content=Text
  '81f7f1b45adb3797debcd9984af03f787eb1da2e': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Disabled, Floating=False, Content=Text
  '18a9b3e250b21eb540e28b52fc3a9931655b3fd5': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Text
  '6a50253f5f46cf6d922460c431842c6c1a3349aa': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Enabled, Floating=False, Content=Text
  'bf6a02fae108e082dc1382ee1d6fecfe554ecd68': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Disabled, Floating=False, Content=Text
  '2d0a1bad2a747f87c9c45de1ff4b4acdad62fa43': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Text
  '704a6d027e23c0b540ca379babd63f6666a386d6': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Enabled, Floating=False, Content=Text
  '1e63b3668255e23a29a43a3fc41df7a9cded8545': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Disabled, Floating=True, Content=Text
  '7fda847d357e1c92b2abe271e9a57943db58dbc0': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Text
  '8a0f833c16fb5dcd32423a0d3d34ab856f9fd9df': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Enabled, Floating=True, Content=Text
  '58f7453d458cc516151ec95bba4cd96dc851d4e6': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Disabled, Floating=True, Content=Text
  'ab15449244beac555fc2f7d81d47731fa6dd075b': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Enabled, Floating=True, Content=Text
  '2a43bcfcfb3e67156a6b75c6b5b265dea09d005d': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Text
  '6f9d1aa573cc0fc91fd01b29f7ca86ddcfdf2a5c': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Enabled, Floating=True, Content=Text
  '85050e49a6d684348fb941fb271293c53fb7feba': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Disabled, Floating=True, Content=Text
  'c1aed5d4b9e88905b06e68f2906304f294251f07': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Text
  '4e7b3fb49037b5052852a5a3a5e6d9bc871598d1': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Disabled, Floating=False, Content=Text
  'b78e5a8c2628f3939a58f6cdec3c45184087fc49': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Text
  '4f8235115ee8e44de3b1162a1f59c79e71ba85c3': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Enabled, Floating=False, Content=Text
  '44812be63eab7e73332feba8b83dbf853ac9acc4': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Disabled, Floating=False, Content=Text
  '1b7d5f8d9e66098a44515670a78c9fb31bd0fa1e': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Text
  'e9b5c862a33c27e320ee4dc1ff6b5f1751ff7e0f': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Enabled, Floating=False, Content=Text
  '79a928fa7633c5dcac9528339354943b22e73c38': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Disabled, Floating=False, Content=Text
  'dc4de13ee5a69840eaa418cb48ac4ebadd181498': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Text
  '177a578c88336796d1d00dbc7512f6b16de4e28d': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Enabled, Floating=False, Content=Text
  'ffd3bb4e9cf8638a2941e98c15f06393dd22998c': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Disabled, Floating=True, Content=Text
  '167805677eb4f225af2863842fda247ead1a45a5': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Text
  'e9022023fb01c235ab4f7ac4490b9ae8b9190415': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Enabled, Floating=True, Content=Text
  'a23a3d65fb149cba56fe1233d0d6255d521aa2ce': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Disabled, Floating=True, Content=Text
  '15bf7cfddc01ef4f375ffff9a7ffeae47e00c9c3': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Text
  '715af68fa5af3f9eec9b0435753380def5139848': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Enabled, Floating=True, Content=Text
  '07b2a3b90486b795b6f8fabd792bae13332de68b': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Enabled, Floating=True, Content=Text
  '1f89d82ae26eaefd45ea7e971fd5a6f5a6e4d4a6': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Disabled, Floating=True, Content=Text
  '34eeb11044ddfe45fb72b6c64ebbd973098e5835': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Text
  'fc7c73f726fc26efb694c47ff154843b6d036717': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Disabled, Floating=False, Content=Icon
  '3d5364a1e98dc0cc0b413b6f5495f42dcb293d97': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Icon
  'dc35a6335c46fcda40587139a01e0cdff159f5a4': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Enabled, Floating=False, Content=Icon
  '86f993be8fbff21fa3110435753723321a9790d4': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Disabled, Floating=False, Content=Icon
  '0f3bfd96b5b29f71917738ccbb72f73cd6b3fba5': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Icon
  '6690e210f6603537c6735a8469dc7a814dc44aed': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Enabled, Floating=False, Content=Icon
  'a4f7d5cd5f4232a3c1e3be81054cb0d8e34d621b': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Disabled, Floating=False, Content=Icon
  '5026d4c4cb197f4e1810069aa8c2751e7a7e08d6': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Icon
  'dd1e26d6af33e302779b605146d3e93bf87271a8': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Enabled, Floating=False, Content=Icon
  '93207580536d377799770bc3951925dda3d68327': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Disabled, Floating=True, Content=Icon
  '147cf7946e896e9301bf928027a219d7776abcab': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Icon
  'af3e360c9ed9bd43db4788a4a3c7cf0e5d5c787c': 'Spandex - Atomic Components',  // Size=Small, Color=Tertiary, State=Enabled, Floating=True, Content=Icon
  '3d46c592ebc63504766c3eeb405f39e0c64b387d': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Disabled, Floating=True, Content=Icon
  '5d569b49254c3cf3e4916c137c9aa656d2cc7a04': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Icon
  '9b7de22aee962d0959695e89c06f4f18e73ccadd': 'Spandex - Atomic Components',  // Size=Small, Color=Secondary, State=Enabled, Floating=True, Content=Icon
  '85dd246fcdc87b6795e3b55557986287070d9f1d': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Disabled, Floating=True, Content=Icon
  'cb9d63cebcc6ea5d66cee8205c5b76edd2e0976b': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Icon
  '5ab3ad3d7d001915a89178e314b6c74b2dc494d0': 'Spandex - Atomic Components',  // Size=Small, Color=Primary*, State=Enabled, Floating=True, Content=Icon
  '031d5d74e5dff2c9f9c68698e96f2e07622409f1': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Disabled, Floating=False, Content=Icon
  '2a49296c4302ef3dd35654eced92353d418bf1ee': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Icon
  '6b2c7b597521e9d4b18355b5aa08c52fce62b521': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Enabled, Floating=False, Content=Icon
  '7a511fd283a39e51f4f54afda02b4adaca5be8d6': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Disabled, Floating=False, Content=Icon
  'f50a294b5352fa9798965f5ebf173fb6815af502': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Icon
  '04b5280613bceb76e57025e6ef243d1e52a00db9': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Enabled, Floating=False, Content=Icon
  'b31d0b97ebd4b287a7c33d3a5244cc27a0abe229': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Disabled, Floating=False, Content=Icon
  'd9cc96fe71c93b08e5035ef6b34ba9d2953efb16': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Icon
  '6e7e665602dcadad8150d0e99f027db8768fade1': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Enabled, Floating=False, Content=Icon
  '058736fe8e05f066339b1f9a3f30c2293f1111de': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Disabled, Floating=True, Content=Icon
  '15342ca68d7e80cd6e2d3d02a51389205c4ee3a0': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Icon
  '874ed796a222df8204012b424ca432b29279efe0': 'Spandex - Atomic Components',  // Size=Medium, Color=Tertiary, State=Enabled, Floating=True, Content=Icon
  'f6c63c9678f99bd29088172f7004f2b0c04bda94': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Disabled, Floating=True, Content=Icon
  '9a02139eed8564c07e6d0a6d56d70439e27b5134': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Icon
  '4b5643b78ba436acae15599d190ca3c8037cd004': 'Spandex - Atomic Components',  // Size=Medium, Color=Secondary, State=Enabled, Floating=True, Content=Icon
  '23dcedf29df1f0b4de1d1ff8aafbf7fc84d030b8': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Disabled, Floating=True, Content=Icon
  '00be5b65b69bedd7905d69adadda7eb77a374b7e': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Icon
  '728fdf69c56edfbf0a933f6f1ed4db1308fcc929': 'Spandex - Atomic Components',  // Size=Medium, Color=Primary*, State=Enabled, Floating=True, Content=Icon
  'b16e2482a1ffc1fe7d0cd2f8532c269726f5f9be': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Disabled, Floating=False, Content=Icon
  'b2d1ec6a9a471d894b67de9c660aef7eff92e2bd': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Icon
  '4bcb25e4da7d41e5c4cf9b465ecbedb2816b456f': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Enabled, Floating=False, Content=Icon
  '4ca90512f079f8accf0e38465bf6c8f24b2ac89d': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Disabled, Floating=False, Content=Icon
  '06936935dd5e047c9876a40ddfa2750ec747a939': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Icon
  'f770acdbb751166717151a53cb925fa828b6e490': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Enabled, Floating=False, Content=Icon
  '3bb8d1fa84c7b0001fd6e6977f8b416766b91d1e': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Disabled, Floating=False, Content=Icon
  '0b191e3c054878ebca5f8c806f5a421d4793efab': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Icon
  '7030a95ab3576d13ee491902be5953b38ae12b46': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Enabled, Floating=False, Content=Icon
  '2f7b5f8cc66bcb6632769cdd020c182db84cd341': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Disabled, Floating=True, Content=Icon
  'e80d1a50e4bf8f4fe4ecdd3cad2095cef68ca022': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Icon
  '7c74bab00c1ea630c81146514b4a25cdfbde0399': 'Spandex - Atomic Components',  // Size=Large, Color=Tertiary, State=Enabled, Floating=True, Content=Icon
  '109aa787792ff394678306067705a860470738b1': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Disabled, Floating=True, Content=Icon
  'fad182079ca78263869137a1ca305d86a368a685': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Icon
  'ec6bd00a1faa3cb3078562b2fbdcb6e2050ccf92': 'Spandex - Atomic Components',  // Size=Large, Color=Secondary, State=Enabled, Floating=True, Content=Icon
  '311d9f136aa9aec561301a14bf1471259395a104': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Disabled, Floating=True, Content=Icon
  '96b7d2171187dd2bc5f4a7d29e692da92fcdbb29': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Icon
  '7410b8e8b3bff6ce8c61be8f628361f2aaa30d41': 'Spandex - Atomic Components',  // Size=Large, Color=Primary*, State=Enabled, Floating=True, Content=Icon
  'ad03265e2ee27c0341f8b1123d9f85be5e381fce': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Disabled, Floating=False, Content=Icon
  '5a661248a874fd65a37ab5fd312acfd63cfb60b8': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Pressed/Hover, Floating=False, Content=Icon
  '84b82faeca63ae0d012f56621bf965c7044291cc': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Enabled, Floating=False, Content=Icon
  '484b43053095268fa2508c1e845ce913a31a6366': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Disabled, Floating=False, Content=Icon
  'c59d9e628c60d7e3759a2611d94f9577d7efcc95': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Pressed/Hover, Floating=False, Content=Icon
  '4f187f155df45db870cca9e3709c64f8a5470b84': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Enabled, Floating=False, Content=Icon
  '922491d570ec5d95913961ab0ebe78a61cd115b9': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Disabled, Floating=False, Content=Icon
  '760aca94dfd158dd0d3e80f0fe27238d2014d685': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Pressed/Hover, Floating=False, Content=Icon
  'bcd0741a017eeb51154337fa7b4616098a446aec': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Enabled, Floating=False, Content=Icon
  '811ec7ba041e4ad76ee4e6396e64db3c636ed676': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Disabled, Floating=True, Content=Icon
  'fdb6405881219c0931973decfb95a44c9a4028bd': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Pressed/Hover, Floating=True, Content=Icon
  'fad36e49560396424da97ab9d519f46b6233786c': 'Spandex - Atomic Components',  // Size=X-Large, Color=Tertiary, State=Enabled, Floating=True, Content=Icon
  '82567adb2ac0d9759ca16ae94629a337b2689c8a': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Disabled, Floating=True, Content=Icon
  '832abc662e014e5bb09389b8a52c53d0759dcbef': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Pressed/Hover, Floating=True, Content=Icon
  '7784dfacd6a61d6ff7234d2cc8d45c80ee4307b7': 'Spandex - Atomic Components',  // Size=X-Large, Color=Secondary, State=Enabled, Floating=True, Content=Icon
  '2b789de8a00f8f91ca0e1b819660ec06167f4da7': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Disabled, Floating=True, Content=Icon
  '07fabae021b12338a022d8b25cfdc16a85eb5389': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Pressed/Hover, Floating=True, Content=Icon
  '365a0df6520bc79c657cbdeaca2583730d5d7d1c': 'Spandex - Atomic Components',  // Size=X-Large, Color=Primary*, State=Enabled, Floating=True, Content=Icon
  'd51ba54ceb3c0104af3f1acc47c6ee131f8f330d': 'Spandex - Atomic Components',  // Emphasis=Primary*, isFullWidth=false, isStacked=true
  '4aa8cd50697c775e87b202ca5b202b13cc8117ae': 'Spandex - Atomic Components',  // Emphasis=Primary*, isFullWidth=true, isStacked=true
  '56facb8a5164e7063c7b8b3321d48bde27facd75': 'Spandex - Atomic Components',  // Emphasis=Primary*, isFullWidth=false, isStacked=false
  'd8846ff82559309ab05ae483c02f74817ac2bcc2': 'Spandex - Atomic Components',  // Emphasis=Primary*, isFullWidth=true, isStacked=false
  '95839b3393280657362f882222577405ea1b4d13': 'Spandex - Atomic Components',  // Emphasis=Tertiary, isFullWidth=false, isStacked=true
  '9396965e2f98a3e6a626ab762c24257639a25a75': 'Spandex - Atomic Components',  // Emphasis=Tertiary, isFullWidth=true, isStacked=true
  'da3a72dbe8a1b20c6943bb8a8525759d3d143a01': 'Spandex - Atomic Components',  // Emphasis=Tertiary, isFullWidth=false, isStacked=false
  '50aa16c52b3cee52414ffc29261f63485166e261': 'Spandex - Atomic Components',  // Emphasis=Tertiary, isFullWidth=true, isStacked=false
  '5854f8c89e084be38d82c44739ace5b13770b7e8': 'Spandex - Atomic Components',  // Emphasis=Secondary, isFullWidth=false, isStacked=true
  '5fe0fdf4554b4f93d5a41ef7fb9f4ec5d719d142': 'Spandex - Atomic Components',  // Emphasis=Secondary, isFullWidth=true, isStacked=true
  '54e52aa73f7ada841372a6a8cc8c4e6fa5c1a94a': 'Spandex - Atomic Components',  // Emphasis=Secondary, isFullWidth=false, isStacked=false
  '08fa4253f63c5b2f8e591d623fd5843d236e04d2': 'Spandex - Atomic Components',  // Emphasis=Secondary, isFullWidth=true, isStacked=false
  '711cfcea01e66f8ab1627128a4b541956880695d': 'Spandex - Atomic Components',  // Emphasis=Secondary-Alt, isFullWidth=false, isStacked=true
  'b6e9e59ee547cd29fb48d926a0da4898629d13d4': 'Spandex - Atomic Components',  // Emphasis=Secondary-Alt, isFullWidth=true, isStacked=true
  '081d679df5e3893c7e6e26f0a5a429e5e4e342ab': 'Spandex - Atomic Components',  // Emphasis=Secondary-Alt, isFullWidth=false, isStacked=false
  '17cdcf770bf592eac6ebde888fb2dee04f6c6f94': 'Spandex - Atomic Components',  // Emphasis=Secondary-Alt, isFullWidth=true, isStacked=false
  '4a9660bc912823871a64f40afad385a036844faa': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary, isPressed=false, isDisabled=false
  '5bc6f56a4bfede597d8152a7cc1bec43350744f9': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary, isPressed=True, isDisabled=false
  '6062500addb9845a2cfd03fa8310d59207ef6d50': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Primary, isPressed=false, isDisabled=false
  '8c98d698b598b68eca2ab854e47b450d35f504fe': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Primary, isPressed=false, isDisabled=true
  'b720c5a30a5649d532cbbe39c316d15b9039e1f1': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary, isPressed=false, isDisabled=false
  '5ed513dffb0545902113a178be9860a5bef2c399': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary, isPressed=false, isDisabled=false
  '5c553774b12371a884db07eb5b1cc3a4ebf21905': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Primary, isPressed=True, isDisabled=false
  'daf75a9b0ab6db62d337becf71c7d1d0b6b8c75f': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Primary, isPressed=false, isDisabled=true
  'caff3cdcf146f1b5c21bc37a0c97d4059bd7e576': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary, isPressed=True, isDisabled=false
  '9ccd334abf8abf060049031aba74edc62873563e': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Primary, isPressed=false, isDisabled=true
  'e8ac22d2550aed6183c9cb80a03c45607ffabb45': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary, isPressed=True, isDisabled=false
  '7b4c075fdee7a528610b02c89d8612eefefdd4e2': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Primary, isPressed=false, isDisabled=true
  '0950f3f37b9993955e75b5a3ce872d9253f1d30d': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Secondary, isPressed=false, isDisabled=false
  'bd3e4babecb4d547a87a95187d1dd043f41e3d5f': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=false, isDisabled=false
  'd2ee7b650bc3789cee79de68afab4b1db2127d9e': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=True, isDisabled=false
  '9a088849c172c38bccb468439df5ebc5ccbae5b7': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=false, isDisabled=false
  'bc1ed440fd25af85a8a9bac00d41458b0dbf64c2': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Secondary, isPressed=false, isDisabled=true
  '39d4daa42e06ee3286e94ab038868022636e8c3e': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=false, isDisabled=false
  '49b8543aac1086b967f9126a592aa97fe2de55c3': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Secondary, isPressed=True, isDisabled=false
  'c081c2ddc2fab9b550fcb209cb0c0de5f02de462': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Secondary, isPressed=false, isDisabled=true
  'e3cb831d8aa7b6ee849bfeb06e20495a8de6f4a7': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=True, isDisabled=false
  'f2f665ab347a8587345a4ad1b94bb1b6b244e2d6': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Secondary, isPressed=false, isDisabled=true
  '19b3e0e8f496804b7f622722b876ca22d8c6d8cf': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=True, isDisabled=false
  'f8c9e01b4f17c48a61ae8cd52d2484d65d1e52c0': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Secondary, isPressed=false, isDisabled=true
  '6014180d77944094cc236ca0c831d5c3ddb352ff': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=false, isDisabled=false
  'cec85e2294efbf33e4b14e95936c3b5084d16d06': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=True, isDisabled=false
  'b3b76ed65d0d92d13404ab94f70950758360e352': 'Spandex - Atomic Components',  // Size=Large, Emphasis=Tertiary, isPressed=false, isDisabled=true
  '5f2b8cf36fd5dd4254eef82b924552b7659de9ec': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Tertiary, isPressed=false, isDisabled=false
  '6396aaf466e6b2f42777aecbd95f4ef435d10f1d': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Tertiary, isPressed=True, isDisabled=false
  '61dfec88243d62f320371d250617f36a4a5f0912': 'Spandex - Atomic Components',  // Size=Medium, Emphasis=Tertiary, isPressed=false, isDisabled=true
  'e2b0bf81b469398e5973147c891fb4bb3b984b01': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=false, isDisabled=false
  '4f41e80c523171f8fbd5b85ba536dd908ebd65c9': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=True, isDisabled=false
  '00c5a328d186147966d89d293e4b3271bbc7f196': 'Spandex - Atomic Components',  // Size=Small, Emphasis=Tertiary, isPressed=false, isDisabled=true
  '625dab25bf4293d4541ccc4c1aa3d64250ca7d6f': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=false, isDisabled=false
  'adc473f197baebffe50289fecc33ee658300ab0f': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=True, isDisabled=false
  '6bc649e5cc320ae9a7b61c0700bdeb4a3fbd49d9': 'Spandex - Atomic Components',  // Size=X Small, Emphasis=Tertiary, isPressed=false, isDisabled=true
  '436594a042a9f44833e3dcda8e575b1e5957dc32': 'Spandex - Atomic Components',  // Logo=Peleton, isDarkMode=false, isPressed=false
  '2c5b7eb31c7f6d48c8bc2bb7450ab0430e5ca2d9': 'Spandex - Atomic Components',  // Logo=Peleton, isDarkMode=false, isPressed=true
  '8d39d50b0aa80e242dad5f2f8c28575652a5a5ac': 'Spandex - Atomic Components',  // Logo=Peleton, isDarkMode=true, isPressed=false
  '662b8cdfa2715208f408a3602e6e3dbb148a5a69': 'Spandex - Atomic Components',  // Logo=Peleton, isDarkMode=true, isPressed=true
  '8031ad51ab95b87341175b9cc258a008e3f0aaff': 'Spandex - Atomic Components',  // Logo=Apple Watch, isDarkMode=false, isPressed=false
  'b86f87df70a5e43fefbb46b7badfd83c1d4beaca': 'Spandex - Atomic Components',  // Logo=Apple Watch, isDarkMode=false, isPressed=true
  '721fc56b5877aa574872a3c4d8e554745a5ed3c1': 'Spandex - Atomic Components',  // Logo=Apple Watch, isDarkMode=true, isPressed=false
  'bd8d394e811ed4adee760c6fa2c4f1cac9d97952': 'Spandex - Atomic Components',  // Logo=Apple Watch, isDarkMode=true, isPressed=true
  'b6e42fc72548a224439b6d9f56cdbbda705a082f': 'Spandex - Atomic Components',  // Logo=Fitbit, isDarkMode=false, isPressed=false
  '41a4fa1f9e31a19c5567364b3b8a2e66605b0c1f': 'Spandex - Atomic Components',  // Logo=Fitbit, isDarkMode=false, isPressed=true
  '11b263d4d0845fd15515a6348fae1659cf4e936a': 'Spandex - Atomic Components',  // Logo=Fitbit, isDarkMode=true, isPressed=false
  '4868f08ee39db56d88c24455a12e16d75299c388': 'Spandex - Atomic Components',  // Logo=Fitbit, isDarkMode=true, isPressed=true
  '789ecee322801b3b032fd8dd535ba41ae4ea296d': 'Spandex - Atomic Components',  // Logo=Garmin, isDarkMode=false, isPressed=false
  '5aa02a99d260578dee3ce6417362239d296a4d21': 'Spandex - Atomic Components',  // Logo=Garmin, isDarkMode=false, isPressed=true
  '28dbdce86b46723ec238a237bb08d3598c266f9d': 'Spandex - Atomic Components',  // Logo=Garmin, isDarkMode=true, isPressed=false
  '932926fdb2685280fc6862b6a93bc2f2fde758dc': 'Spandex - Atomic Components',  // Logo=Garmin, isDarkMode=true, isPressed=true
  '4eb21da29588180301b19a61d676d0751d57f5e9': 'Spandex - Atomic Components',  // Logo=Oura, isDarkMode=false, isPressed=false
  'c9e0481fdf13c0d69c75222ec1a6ba07d38fd13f': 'Spandex - Atomic Components',  // Logo=Oura, isDarkMode=false, isPressed=true
  '3cb5329cc9662528e57454f9ea9d331f62de610b': 'Spandex - Atomic Components',  // Logo=Oura, isDarkMode=true, isPressed=false
  'a98c1627d9868e7120775bc149460181b0efbddb': 'Spandex - Atomic Components',  // Logo=Oura, isDarkMode=true, isPressed=true
  '1c36374b590123bc0846a233b3b599e52f1f3fac': 'Spandex - Atomic Components',  // Logo=Polar, isDarkMode=false, isPressed=false
  '28c8a26ed655ad0f1e308eba77678c5d533aabd5': 'Spandex - Atomic Components',  // Logo=Polar, isDarkMode=false, isPressed=true
  'b27a94218c56dada52e9fa13faf57d0b1f99a6a3': 'Spandex - Atomic Components',  // Logo=Polar, isDarkMode=true, isPressed=false
  '1b9882ccf9f3e8bbe5eacd7f41f8362ffac61e63': 'Spandex - Atomic Components',  // Logo=Polar, isDarkMode=true, isPressed=true
  '65ac0b418f272088e8484b6dbcc6e79035a8b485': 'Spandex - Atomic Components',  // Logo=Rouvy, isDarkMode=false, isPressed=false
  '91fa5efd47ad94aa7c84e65aba88911cb4cf75ed': 'Spandex - Atomic Components',  // Logo=Rouvy, isDarkMode=false, isPressed=true
  '427ea3b99defb518852deb8058517d0dac26f1e4': 'Spandex - Atomic Components',  // Logo=Rouvy, isDarkMode=true, isPressed=false
  '44f3e5648aaa799e6bdd2d7908ce1bf62e69b043': 'Spandex - Atomic Components',  // Logo=Rouvy, isDarkMode=true, isPressed=true
  '7f7296c02b60d82ad51ffdf1ebdb26ac7e34c156': 'Spandex - Atomic Components',  // Logo=Samsung, isDarkMode=false, isPressed=false
  'fa18051bf181faf08b7a0528d818c5b53c074c24': 'Spandex - Atomic Components',  // Logo=Samsung, isDarkMode=false, isPressed=true
  '6156b19ea1931bd0bd0072298be076c1b4cf2ba8': 'Spandex - Atomic Components',  // Logo=Samsung, isDarkMode=true, isPressed=false
  '799df7a22e270b18a644b7cc572330292ec32cb3': 'Spandex - Atomic Components',  // Logo=Samsung, isDarkMode=true, isPressed=true
  '74ae8a644898eca2cad8f8c414132a28d9eaf260': 'Spandex - Atomic Components',  // Logo=Suunto, isDarkMode=false, isPressed=false
  'cb6cb5e339a1c2eb508b8fb2851357d8b98d269e': 'Spandex - Atomic Components',  // Logo=Suunto, isDarkMode=false, isPressed=true
  '5b543a40b612bbfd92015612ec890c837479ad2f': 'Spandex - Atomic Components',  // Logo=Suunto, isDarkMode=true, isPressed=false
  '628d2d3207efb1936d9dc9ff25d11c573e6eb357': 'Spandex - Atomic Components',  // Logo=Suunto, isDarkMode=true, isPressed=true
  'ff3ee433327657e8379bc9aa415f90cdad13b280': 'Spandex - Atomic Components',  // Logo=TomTom, isDarkMode=false, isPressed=false
  '56f35677bd45e890bf9596e4e8033e10e03ad1a8': 'Spandex - Atomic Components',  // Logo=TomTom, isDarkMode=false, isPressed=true
  '24d4818a2cab0841dabab9522a6ab80727d909d4': 'Spandex - Atomic Components',  // Logo=TomTom, isDarkMode=true, isPressed=false
  'e56fa6bfe591918d629d93b046fbee915ac9ded6': 'Spandex - Atomic Components',  // Logo=TomTom, isDarkMode=true, isPressed=true
  '6f401d6f5681e72aaf4a50147109d1d214cbfa3c': 'Spandex - Atomic Components',  // Logo=Wahoo, isDarkMode=false, isPressed=false
  '6141f90a6913d41d0a309e30fcebd59f3ceb8919': 'Spandex - Atomic Components',  // Logo=Wahoo, isDarkMode=false, isPressed=true
  '7fb5dc0d82f91f8e3c8c66547b916ee369403a86': 'Spandex - Atomic Components',  // Logo=Wahoo, isDarkMode=true, isPressed=false
  '092a8b04d135e13e21c9972addbbbc171c0bc9ed': 'Spandex - Atomic Components',  // Logo=Wahoo, isDarkMode=true, isPressed=true
  '374d9cfec6f08c9b49e76eed177bac87d1e539f1': 'Spandex - Atomic Components',  // Logo=Whoop, isDarkMode=false, isPressed=false
  '3121661c4cb5739b28f4958ce6382fa0f7cc6173': 'Spandex - Atomic Components',  // Logo=Whoop, isDarkMode=false, isPressed=true
  '922a94a90d80932e202b3186ce8cadfbeea5b343': 'Spandex - Atomic Components',  // Logo=Whoop, isDarkMode=true, isPressed=false
  'aeb8b46eeee2e9873f4616bd421fe225e202ce30': 'Spandex - Atomic Components',  // Logo=Whoop, isDarkMode=true, isPressed=true
  '8b5eec0e20e9b8bae71996cc819992733ba99021': 'Spandex - Atomic Components',  // Logo=Zwift, isDarkMode=false, isPressed=false
  '47d7060a2e2bfec0dcaf771077312f778fb8fa4a': 'Spandex - Atomic Components',  // Logo=Zwift, isDarkMode=false, isPressed=true
  '98b4b336e24726818540b1f764d4ba41e4632b78': 'Spandex - Atomic Components',  // Logo=Zwift, isDarkMode=true, isPressed=false
  '16f815b22c9069eebb9605dd794528ed2f41b653': 'Spandex - Atomic Components',  // Logo=Zwift, isDarkMode=true, isPressed=true
  '16015f2a2f0c0bd4592c00c98ae98682fe068023': 'Spandex - Atomic Components',  // Logo=WearOS by Google, isDarkMode=false, isPressed=false
  '0907319b12efb213683a2d31d092ba88efc068c0': 'Spandex - Atomic Components',  // Logo=WearOS by Google, isDarkMode=false, isPressed=true
  '72d15b718ebc769e460a6adf201a3dc82c322914': 'Spandex - Atomic Components',  // Logo=WearOS by Google, isDarkMode=true, isPressed=false
  'b93db7edd8c6101324d124f3c8cb59fb0f0efa56': 'Spandex - Atomic Components',  // Logo=WearOS by Google, isDarkMode=true, isPressed=true
  '017ff28f2b014a9fd6c7f3dda1547ec298114d6a': 'Spandex - Atomic Components',  // Logo=Nike, isDarkMode=false, isPressed=false
  'c1e358315d8e792e41e713d37cd0aef85e43001f': 'Spandex - Atomic Components',  // Logo=Nike, isDarkMode=false, isPressed=true
  'd3f78fe509bcd66b78aa23eb5cf2b9501ac5426b': 'Spandex - Atomic Components',  // Logo=Nike, isDarkMode=true, isPressed=false
  '4eb7b9317d67c1b8096404fd274eb690e1bd6fa3': 'Spandex - Atomic Components',  // Logo=Nike, isDarkMode=true, isPressed=true
  '0fdb6888298e4a96e46a061afd23b2795481e2bc': 'Spandex - Atomic Components',  // Logo=Amazfit, isDarkMode=false, isPressed=false
  '791eb3a666b6b222f74ac145f9794ebba6bfd463': 'Spandex - Atomic Components',  // Logo=Amazfit, isDarkMode=false, isPressed=true
  '24fb74cdb54ed33542431712a354a94d00e1277f': 'Spandex - Atomic Components',  // Logo=Amazfit, isDarkMode=true, isPressed=false
  '5abafce328ee71861c5452fc94eb550b51e51d94': 'Spandex - Atomic Components',  // Logo=Amazfit, isDarkMode=true, isPressed=true
  '036e518c9afe5211d87ab6053fb532bd36f3ae2b': 'Spandex - Atomic Components',  // Logo=Coros, isDarkMode=false, isPressed=false
  'c6e26f115f8c884f37f12b278d59514eabb93653': 'Spandex - Atomic Components',  // Logo=Coros, isDarkMode=false, isPressed=true
  '0a965d9e1fc5c9bdb17ecb3e98650c1be2b2dc61': 'Spandex - Atomic Components',  // Logo=Coros, isDarkMode=true, isPressed=false
  '8050b2218ec21a69eb5918475899a06d56c0db58': 'Spandex - Atomic Components',  // Logo=Coros, isDarkMode=true, isPressed=true
  'ddcd4227ae39807770484cab432f3c78c03cf861': 'Spandex - Atomic Components',  // Logo=Bryton, isDarkMode=false, isPressed=false
  '08ca132e201bc3adbf38380655355815e16ebe04': 'Spandex - Atomic Components',  // Logo=Bryton, isDarkMode=false, isPressed=true
  '18d33e61778893057601a9841b294f5daae470bf': 'Spandex - Atomic Components',  // Logo=Bryton, isDarkMode=true, isPressed=false
  'e78c7368963444431f9225561d216f4606a49dbc': 'Spandex - Atomic Components',  // Logo=Bryton, isDarkMode=true, isPressed=true
  '11f26a6862a1e7159490308dcee47f7b6f704233': 'Spandex - Atomic Components',  // Logo=Huawei, isDarkMode=false, isPressed=false
  '8df116e094a67037248da41e66d52015af186973': 'Spandex - Atomic Components',  // Logo=Huawei, isDarkMode=false, isPressed=true
  '1a7bddb6ad72c4684e45692d8d2973bf2550b89b': 'Spandex - Atomic Components',  // Logo=Huawei, isDarkMode=true, isPressed=false
  '6618cdb6a43cc4882dd48c824ea984670330cb88': 'Spandex - Atomic Components',  // Logo=Huawei, isDarkMode=true, isPressed=true
  '6153cb97bf40a780c2797ce6f38e1b453eb6e452': 'Spandex - Atomic Components',  // isLogo=true, isIconText=false, isText=false
  '4e0c60f526561a8fdfd1c4bdc5fc53839ecea9eb': 'Spandex - Atomic Components',  // isLogo=false, isIconText=true, isText=false
  'b1bccefd33997670165f0b31e87d2c562064d168': 'Spandex - Atomic Components',  // isLogo=false, isIconText=false, isText=true
  'f785b2b3a8c8d9eaf841998497ba8d994cc21cbe': 'Spandex - Atomic Components',  // Partner=Garmin, isPressed=false, isSelected=false, isDarkMode=false
  '752103b8c9b2d47d9c62443dd8ee759af3133e4d': 'Spandex - Atomic Components',  // Partner=Garmin, isPressed=true, isSelected=false, isDarkMode=false
  '4dc66fb317dcfb1524404de2bf1aeef10bbd1a6d': 'Spandex - Atomic Components',  // Partner=Garmin, isPressed=false, isSelected=true, isDarkMode=false
  '9203fd02408df3f1b1399382dd0bccb2660fe65c': 'Spandex - Atomic Components',  // Partner=Garmin, isPressed=false, isSelected=false, isDarkMode=true
  'ecb8f23b052793f2887f7ebb0b728248b4330e38': 'Spandex - Atomic Components',  // Partner=Garmin, isPressed=true, isSelected=false, isDarkMode=true
  '6a20dc3624b99e99e6447a4eb7f3dc6bca211766': 'Spandex - Atomic Components',  // Partner=Garmin, isPressed=false, isSelected=true, isDarkMode=true
  'c9b4e7f2d1a455b1e158c57f30cf2222fa98bda4': 'Spandex - Atomic Components',  // Partner=Amazfit, isPressed=false, isSelected=false, isDarkMode=false
  '15d61500787ee1119e19e7450913e0ecd9cb72cf': 'Spandex - Atomic Components',  // Partner=Amazfit, isPressed=true, isSelected=false, isDarkMode=false
  'c5bf5e03ae60b5c47977f7e60088f8640ef9a18f': 'Spandex - Atomic Components',  // Partner=Amazfit, isPressed=false, isSelected=true, isDarkMode=false
  '4c3a424e01ba72c057847b39c46cd64e2d8ae7c7': 'Spandex - Atomic Components',  // Partner=Amazfit, isPressed=false, isSelected=false, isDarkMode=true
  'ab12fc1014696bbf3d7d4e77046c9af71cd1af1d': 'Spandex - Atomic Components',  // Partner=Amazfit, isPressed=true, isSelected=false, isDarkMode=true
  '3dbb706587120c62bd4e5a59da50413ec6f96261': 'Spandex - Atomic Components',  // Partner=Amazfit, isPressed=false, isSelected=true, isDarkMode=true
  'ce8283491389a7f0ce507c15c1095499c96ff1d6': 'Spandex - Atomic Components',  // Partner=Apple Watch, isPressed=false, isSelected=false, isDarkMode=false
  'aa9f5bd48339067994f3e17237c90ec555a04759': 'Spandex - Atomic Components',  // Partner=Apple Watch, isPressed=true, isSelected=false, isDarkMode=false
  '64a28e6d44e74ef1dcf1f42f9764c146ff07dd3e': 'Spandex - Atomic Components',  // Partner=Apple Watch, isPressed=false, isSelected=true, isDarkMode=false
  '4316855b8d27cb822f1137ca2ca6a144ed54306f': 'Spandex - Atomic Components',  // Partner=Apple Watch, isPressed=false, isSelected=false, isDarkMode=true
  '765c540c4fedd986e170ef654bd77b050a14c55e': 'Spandex - Atomic Components',  // Partner=Apple Watch, isPressed=true, isSelected=false, isDarkMode=true
  '1109742ff7d3f56acad7182b7954dde565ce8296': 'Spandex - Atomic Components',  // Partner=Apple Watch, isPressed=false, isSelected=true, isDarkMode=true
  '4d2e79c5f3d97af5423a92a69433621ec9153111': 'Spandex - Atomic Components',  // Partner=Bryton, isPressed=false, isSelected=false, isDarkMode=false
  'aac269802fa185bd8d9068f06c8ea4e9d736423c': 'Spandex - Atomic Components',  // Partner=Bryton, isPressed=true, isSelected=false, isDarkMode=false
  'd11d1b86f1444d72937b532055cc31d29040b415': 'Spandex - Atomic Components',  // Partner=Bryton, isPressed=false, isSelected=true, isDarkMode=false
  'c0f3498589a5d1105b92bba5bcf6ac137c856712': 'Spandex - Atomic Components',  // Partner=Bryton, isPressed=false, isSelected=false, isDarkMode=true
  'b9246877370a98e0f492475c17610f0a2c46e80f': 'Spandex - Atomic Components',  // Partner=Bryton, isPressed=true, isSelected=false, isDarkMode=true
  'df736a8897b9a1b3b4b76134306ab12a56b9d445': 'Spandex - Atomic Components',  // Partner=Bryton, isPressed=false, isSelected=true, isDarkMode=true
  '50330c739029e8f92d0e7ed20456c8d8e5caf30d': 'Spandex - Atomic Components',  // Partner=Coros, isPressed=false, isSelected=false, isDarkMode=false
  'b4ddaa84c11f09280db4d41dada9ed89bd96c4e6': 'Spandex - Atomic Components',  // Partner=Coros, isPressed=true, isSelected=false, isDarkMode=false
  '8493c264df4631700c7b652f0a5fb1ee2f9ee6f7': 'Spandex - Atomic Components',  // Partner=Coros, isPressed=false, isSelected=true, isDarkMode=true
  'be95d137c798fe7b706e7dca5512be4abf66adcc': 'Spandex - Atomic Components',  // Partner=Coros, isPressed=false, isSelected=false, isDarkMode=true
  '5409657ebb326b2a8d9f8dd36480a4f8082b43df': 'Spandex - Atomic Components',  // Partner=Coros, isPressed=true, isSelected=false, isDarkMode=true
  'b54a44b6388e3769d43b114c3d6f3265f8f2e9f2': 'Spandex - Atomic Components',  // Partner=Coros, isPressed=false, isSelected=true, isDarkMode=false
  '8234d88f6bb4f8df1d0263767c68fae59723c3bb': 'Spandex - Atomic Components',  // Partner=Fitbit, isPressed=false, isSelected=false, isDarkMode=false
  'f82880c3e19882b823bb2819bf3b9c9d163296ee': 'Spandex - Atomic Components',  // Partner=Fitbit, isPressed=true, isSelected=false, isDarkMode=false
  '9cc7b346b75313c70fcbb7652ff3e73b3780b3e0': 'Spandex - Atomic Components',  // Partner=Fitbit, isPressed=false, isSelected=true, isDarkMode=true
  'fcd6371c045a2454c4eb1a19edd2a425df26c23f': 'Spandex - Atomic Components',  // Partner=Fitbit, isPressed=false, isSelected=false, isDarkMode=true
  '285e6794625b36ff9734628ff4afb8b76014d656': 'Spandex - Atomic Components',  // Partner=Fitbit, isPressed=true, isSelected=false, isDarkMode=true
  '18ec5527c0c4fa3ae00c0e4302d7b92b2774c304': 'Spandex - Atomic Components',  // Partner=Fitbit, isPressed=false, isSelected=true, isDarkMode=false
  '067b59e4d041bae3413dfb298745d13f279bc131': 'Spandex - Atomic Components',  // Partner=Huawei, isPressed=false, isSelected=false, isDarkMode=false
  'faf229f21c82354a82722fd91bfd146a38e44cab': 'Spandex - Atomic Components',  // Partner=Huawei, isPressed=true, isSelected=false, isDarkMode=false
  '0f010a1e2eb8e38c36649d4f9ff43913c785f972': 'Spandex - Atomic Components',  // Partner=Huawei, isPressed=false, isSelected=true, isDarkMode=false
  '4e7188f4b0a1ce130b78297e5df0e9d8b186a321': 'Spandex - Atomic Components',  // Partner=Huawei, isPressed=false, isSelected=false, isDarkMode=true
  '52ad2c254251ae5adc5b9d128be8a7c64e2cf2b7': 'Spandex - Atomic Components',  // Partner=Huawei, isPressed=true, isSelected=false, isDarkMode=true
  '7fc7425f28eba6e8374f52d059a8a7170a196fc2': 'Spandex - Atomic Components',  // Partner=Huawei, isPressed=false, isSelected=true, isDarkMode=true
  'a1e2aaad75f579a264aab5debb3a611c2db13196': 'Spandex - Atomic Components',  // Partner=Nike, isPressed=false, isSelected=false, isDarkMode=false
  '762cdd595a3be825b9a060862d08a4930c0b673c': 'Spandex - Atomic Components',  // Partner=Nike, isPressed=true, isSelected=false, isDarkMode=false
  '1b0e6ee843390a6f5b22fbd95cf7c47b16d93d40': 'Spandex - Atomic Components',  // Partner=Nike, isPressed=false, isSelected=true, isDarkMode=false
  '38c39836c89a8344c3502227ae1dc6f1b8e3e88a': 'Spandex - Atomic Components',  // Partner=Nike, isPressed=false, isSelected=false, isDarkMode=true
  '81f2cf62f6c0a1f0356f0ef2e621f2b384623918': 'Spandex - Atomic Components',  // Partner=Nike, isPressed=true, isSelected=false, isDarkMode=true
  '3ccaed565410eaf3d146d5755e417203ef878161': 'Spandex - Atomic Components',  // Partner=Nike, isPressed=false, isSelected=true, isDarkMode=true
  '701bb60587bc14a584379732b6e3824577afff2a': 'Spandex - Atomic Components',  // Partner=Oura, isPressed=false, isSelected=false, isDarkMode=false
  '057872e455101f0f04e55d532c29ff85a6a213a8': 'Spandex - Atomic Components',  // Partner=Oura, isPressed=true, isSelected=false, isDarkMode=false
  'f493b494d00400c060c2e867a22378ae4bd72bde': 'Spandex - Atomic Components',  // Partner=Oura, isPressed=false, isSelected=true, isDarkMode=false
  '04b2c73efe421a36e5e08dc74082d1b444b6cc27': 'Spandex - Atomic Components',  // Partner=Oura, isPressed=false, isSelected=false, isDarkMode=true
  '77383e0c1beb1a73de57c5403cc0f1829e80700f': 'Spandex - Atomic Components',  // Partner=Oura, isPressed=true, isSelected=false, isDarkMode=true
  '819deb17924e97eb75931e1127f79ab720961879': 'Spandex - Atomic Components',  // Partner=Oura, isPressed=false, isSelected=true, isDarkMode=true
  '89a448a3ad96189e81701092f878332df5ed1267': 'Spandex - Atomic Components',  // Partner=Peloton, isPressed=false, isSelected=false, isDarkMode=false
  '438c767c8a29f61684770134c642113e3643f5d3': 'Spandex - Atomic Components',  // Partner=Peloton, isPressed=true, isSelected=false, isDarkMode=false
  '6a71f821a1ffad5949308f9bcf0a68b204b3b3ca': 'Spandex - Atomic Components',  // Partner=Peloton, isPressed=false, isSelected=true, isDarkMode=false
  'd1275b7ac01a9e3733a42937002dc6865eb76f2c': 'Spandex - Atomic Components',  // Partner=Peloton, isPressed=false, isSelected=false, isDarkMode=true
  'cc571a2cca3bac8aebd59b5b6941bd55f4a98b7c': 'Spandex - Atomic Components',  // Partner=Peloton, isPressed=true, isSelected=false, isDarkMode=true
  '90ea721bc5fb578219c48707439f754a3bbd0658': 'Spandex - Atomic Components',  // Partner=Peloton, isPressed=false, isSelected=true, isDarkMode=true
  'ef5942e5691080c0f8895a7374ba8f045c55db53': 'Spandex - Atomic Components',  // Partner=Polar, isPressed=false, isSelected=false, isDarkMode=false
  'a79c352b92b05a6a2c63274615dee3da8ccee37f': 'Spandex - Atomic Components',  // Partner=Polar, isPressed=true, isSelected=false, isDarkMode=false
  'fb0db758e897ebd31ad4b0d0c2d8d1a20666774d': 'Spandex - Atomic Components',  // Partner=Polar, isPressed=false, isSelected=true, isDarkMode=false
  '021f1d70d48bf7ee07a25c7b1b8dfd44a17bad1f': 'Spandex - Atomic Components',  // Partner=Polar, isPressed=false, isSelected=false, isDarkMode=true
  '18a15290de530a747f497400734dd557e80a7300': 'Spandex - Atomic Components',  // Partner=Polar, isPressed=true, isSelected=false, isDarkMode=true
  '39bf29f01fffee7895a46249fa8318c358e826f7': 'Spandex - Atomic Components',  // Partner=Polar, isPressed=false, isSelected=true, isDarkMode=true
  'df32ba18f363b890b1f58ebe08afa17433e47e21': 'Spandex - Atomic Components',  // Partner=Rouvy, isPressed=false, isSelected=false, isDarkMode=false
  '608542627f541cdd98cec9e3ebfedcd0b634cc8f': 'Spandex - Atomic Components',  // Partner=Rouvy, isPressed=true, isSelected=false, isDarkMode=false
  'f7755b9690d7170f7f6a4bb7ad078596256de68c': 'Spandex - Atomic Components',  // Partner=Rouvy, isPressed=false, isSelected=true, isDarkMode=false
  'd5c195b517fec08f01a79f20a9df3753a4af0ede': 'Spandex - Atomic Components',  // Partner=Rouvy, isPressed=false, isSelected=false, isDarkMode=true
  '7dde16120473d7354fc572f0ecb98d4272d7726a': 'Spandex - Atomic Components',  // Partner=Rouvy, isPressed=true, isSelected=false, isDarkMode=true
  '3d54f3852f27566ea203d2ad33caf942c86bb9eb': 'Spandex - Atomic Components',  // Partner=Rouvy, isPressed=false, isSelected=true, isDarkMode=true
  'c17d54ecba32915236edb869e9bef1185066e94b': 'Spandex - Atomic Components',  // Partner=Samsung, isPressed=false, isSelected=false, isDarkMode=false
  '349b1affea26d81a1da91f0b926fe952409e2300': 'Spandex - Atomic Components',  // Partner=Samsung, isPressed=true, isSelected=false, isDarkMode=false
  '1eb7f816e41280988fedcec5b86bfccf37417d1e': 'Spandex - Atomic Components',  // Partner=Samsung, isPressed=false, isSelected=true, isDarkMode=false
  'd61e183c7c4a26b218c1bf2c2d60231517916b6a': 'Spandex - Atomic Components',  // Partner=Samsung, isPressed=false, isSelected=false, isDarkMode=true
  '512db89e10c5240912fd86838b6a65567558eefa': 'Spandex - Atomic Components',  // Partner=Samsung, isPressed=true, isSelected=false, isDarkMode=true
  'c22a3f779dcf39bdb465ab9696f69aac77b28ae7': 'Spandex - Atomic Components',  // Partner=Samsung, isPressed=false, isSelected=true, isDarkMode=true
  'e2af54848910f637b20cf3738ed50f055f7ab358': 'Spandex - Atomic Components',  // Partner=TomTom, isPressed=false, isSelected=false, isDarkMode=false
  '1abc9caba73abc0ba7db002fc0d0b5b6035151e1': 'Spandex - Atomic Components',  // Partner=TomTom, isPressed=true, isSelected=false, isDarkMode=false
  '4fac61bdbd0b79132ec46c3b793642ee00e10e32': 'Spandex - Atomic Components',  // Partner=TomTom, isPressed=false, isSelected=true, isDarkMode=false
  'aff224f3d857a41637b6cc74bdc92beba5b43251': 'Spandex - Atomic Components',  // Partner=TomTom, isPressed=false, isSelected=false, isDarkMode=true
  '60d5acd551b659e275d304a7fa8c970bc4467414': 'Spandex - Atomic Components',  // Partner=TomTom, isPressed=true, isSelected=false, isDarkMode=true
  'f62dd41f9218e0d358c1d93eb2245d1273f1a785': 'Spandex - Atomic Components',  // Partner=TomTom, isPressed=false, isSelected=true, isDarkMode=true
  '60b8a7ab94a579b676f3b114903bd15d709c8b85': 'Spandex - Atomic Components',  // Partner=Suunto, isPressed=false, isSelected=false, isDarkMode=false
  '3be449d10833a3412ba6b01cf704db661346be17': 'Spandex - Atomic Components',  // Partner=Suunto, isPressed=true, isSelected=false, isDarkMode=false
  'b28fd44c0ed1f5aeb4c048501a04a48afdf55fab': 'Spandex - Atomic Components',  // Partner=Suunto, isPressed=false, isSelected=true, isDarkMode=false
  '01b17eb847dabfc75b40fc213112202dde551c8a': 'Spandex - Atomic Components',  // Partner=Suunto, isPressed=false, isSelected=false, isDarkMode=true
  'b3d06c0c7220f53a6e2d04f0cd70f76e969ffe5b': 'Spandex - Atomic Components',  // Partner=Suunto, isPressed=true, isSelected=false, isDarkMode=true
  'a006cc46ca6cdb1385d7c1f04ecf2aa2b3578e36': 'Spandex - Atomic Components',  // Partner=Suunto, isPressed=false, isSelected=true, isDarkMode=true
  '418424bbd3758c856f1fed7de5e09af808eec8d6': 'Spandex - Atomic Components',  // Partner=Wahoo, isPressed=false, isSelected=false, isDarkMode=false
  '9f37a46698d32b8eb672f7e34c439cbc8ef7a3ad': 'Spandex - Atomic Components',  // Partner=Wahoo, isPressed=true, isSelected=false, isDarkMode=false
  'fef15568d0d33c7c699061706544e9c9ef7fb6c9': 'Spandex - Atomic Components',  // Partner=Wahoo, isPressed=false, isSelected=true, isDarkMode=false
  '107be84daf9a258b3772596bfb849f7944ee49aa': 'Spandex - Atomic Components',  // Partner=Wahoo, isPressed=false, isSelected=false, isDarkMode=true
  '4ead9735c919de27f16411f180b62487d2d349db': 'Spandex - Atomic Components',  // Partner=Wahoo, isPressed=true, isSelected=false, isDarkMode=true
  'faac33c63b3a72e99fe41a75efb327f335ce8743': 'Spandex - Atomic Components',  // Partner=Wahoo, isPressed=false, isSelected=true, isDarkMode=true
  'b0e1ebf16353afbb1e0f483c2131f924e30edfec': 'Spandex - Atomic Components',  // Partner=WearOS by Google, isPressed=false, isSelected=false, isDarkMode=false
  'e4b41aee19310bd8c1c55160f08fe10432ec6134': 'Spandex - Atomic Components',  // Partner=WearOS by Google, isPressed=true, isSelected=false, isDarkMode=false
  '7acde480a7309cc1ee7bad7cd0b1faf1b9eb2f09': 'Spandex - Atomic Components',  // Partner=WearOS by Google, isPressed=false, isSelected=true, isDarkMode=false
  '648e36a2f49d8a6f729bf3dbf1e927fe36ceeda2': 'Spandex - Atomic Components',  // Partner=WearOS by Google, isPressed=false, isSelected=false, isDarkMode=true
  'd737b4c8fb0c948ec8041d38545cc1ce3038cb5f': 'Spandex - Atomic Components',  // Partner=WearOS by Google, isPressed=true, isSelected=false, isDarkMode=true
  '8c82a11fcc96eff14390ab5cb166d91af0a3b80a': 'Spandex - Atomic Components',  // Partner=WearOS by Google, isPressed=false, isSelected=true, isDarkMode=true
  '807089b9f3ef4cbe6b51ca4c9a944539a429be3e': 'Spandex - Atomic Components',  // Partner=Whoop, isPressed=false, isSelected=false, isDarkMode=false
  '4da9ec1edd5dbf2677c9536277dfd82e9727e43f': 'Spandex - Atomic Components',  // Partner=Whoop, isPressed=true, isSelected=false, isDarkMode=false
  '46d2a519052b5a4ca693ea97b0f1da24e61eff25': 'Spandex - Atomic Components',  // Partner=Whoop, isPressed=false, isSelected=true, isDarkMode=false
  '2b08c35de948f52a09ff6864869b431c8c51926e': 'Spandex - Atomic Components',  // Partner=Whoop, isPressed=false, isSelected=false, isDarkMode=true
  '51ab896f980bb8b121d0c6930cca721e9b37eeff': 'Spandex - Atomic Components',  // Partner=Whoop, isPressed=true, isSelected=false, isDarkMode=true
  '53845a35f136af22c3e97a1365d22d01620e9439': 'Spandex - Atomic Components',  // Partner=Whoop, isPressed=false, isSelected=true, isDarkMode=true
  '87b89ef08f1d817ab9478f4a4f8a7ada4250c816': 'Spandex - Atomic Components',  // Partner=Zwift, isPressed=false, isSelected=false, isDarkMode=false
  '9191eec04778a6b1ba24f4a58846459de2ee1fad': 'Spandex - Atomic Components',  // Partner=Zwift, isPressed=true, isSelected=false, isDarkMode=false
  '689c8726c716c8e5e7e2badfc10968a2ad984ef8': 'Spandex - Atomic Components',  // Partner=Zwift, isPressed=false, isSelected=true, isDarkMode=false
  '5881fd6eddab25bc4a3f61948dc0b2fad08dd5ab': 'Spandex - Atomic Components',  // Partner=Zwift, isPressed=false, isSelected=false, isDarkMode=true
  '963385c0f28cecaf5640290bfe7cf4106ab494fc': 'Spandex - Atomic Components',  // Partner=Zwift, isPressed=true, isSelected=false, isDarkMode=true
  '0f89dfac64b371f0b18adde7232a3d706a38002e': 'Spandex - Atomic Components',  // Partner=Zwift, isPressed=false, isSelected=true, isDarkMode=true
  '6c10ceb2c9ec69ad16708273d7ad00467e5e4453': 'Spandex - Atomic Components',  // isPressed=false, isSelected=false
  '5d7edde5416de9e96daeb4d76cef4d48cdee328f': 'Spandex - Atomic Components',  // isPressed=true, isSelected=false
  '33c65d9718bb3e9970e0a3375bbdc5056a056ff3': 'Spandex - Atomic Components',  // isPressed=false, isSelected=true
  '9475bfb0a15bc063f61310a85724b6d1a04911b5': 'Spandex - Atomic Components',  // isPressed=false, isSelected=false, isCentered=false
  '9cfcc9d12fda6f45a528097fdd62b2dfb813e2af': 'Spandex - Atomic Components',  // isPressed=true, isSelected=false, isCentered=false
  '10c1e77f81d6df85676ebf353235c717e47bc719': 'Spandex - Atomic Components',  // isPressed=false, isSelected=true, isCentered=false
  '907ea7b4f46f1d4fa3d0d29687dbc9ec918b152a': 'Spandex - Atomic Components',  // isPressed=false, isSelected=false, isCentered=true
  '6728e1484bd1391527e07bbe34ead7f00475ba8d': 'Spandex - Atomic Components',  // isPressed=true, isSelected=false, isCentered=true
  '4be7e1fb1d303261bf49027ff7456ecebdac0fd4': 'Spandex - Atomic Components',  // isPressed=false, isSelected=true, isCentered=true
  'f87508cb4fd2ee23e2cb15cd9931b8a5b8222e06': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Small, isOutlined=False, isFloating=True
  'c5be47c061cf644e7f3c3e0d81b9bb39bb299ec9': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Small, isOutlined=True, isFloating=False
  '28a0bab3ca46a87577a069458e59a7a79f1e9c56': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Small, isOutlined=False, isFloating=False
  'b4ec27fe681a3f864dbb1c1a9d5bf7ca38da24f1': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Small, isOutlined=False, isFloating=True
  '196371f5b09bc8489e5b84e398919258a525ca59': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Small, isOutlined=True, isFloating=False
  '18bbe567712d6db7552be60741e5bb017c38cdd1': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Small, isOutlined=False, isFloating=False
  '5db57442986e7103244f810675382545293d1b69': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Small, isOutlined=False, isFloating=True
  '8a46b17ecf7a57889fc6fe690de6b929ff79443c': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Small, isOutlined=True, isFloating=False
  '2963f8e067918ad2982d4455aed90cd43e4e3b42': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Small, isOutlined=False, isFloating=False
  'bd7291f15e3f3583198465007a8092b4440b5604': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Medium, isOutlined=False, isFloating=True
  'e147f4dfb1af93b443efc444ef406bf5afc855c0': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Medium, isOutlined=True, isFloating=False
  'f3fa210394016027b6fe519d795fc41400f3d274': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Medium, isOutlined=False, isFloating=False
  '31b2bcf3e87ea5c2681209ee1765e5a930006a5b': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Medium, isOutlined=False, isFloating=True
  '43d14d90ce0e2388431d15fc17c359d479c5ca53': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Medium, isOutlined=True, isFloating=False
  '58bcb411d5ecef3eb8515b61acd2fe2a16bf007d': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Medium, isOutlined=False, isFloating=False
  'a3c57d796df6da661f5018babfb75120e11db29a': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Medium, isOutlined=False, isFloating=True
  '55ad1f0e9a6e38b503bf7690c94061753c917c4f': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Medium, isOutlined=True, isFloating=False
  '70e0859a53f50c96ad1a8a10e7f749eba325f9c3': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Medium, isOutlined=False, isFloating=False
  '1fd86cad93a7ffaa3371fdd3afb342b6d0fc3752': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Large, isOutlined=False, isFloating=True
  '8b07a10229837f6d5f509bc2201bd865649ea916': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Large, isOutlined=True, isFloating=False
  '1b0b261dc8f62b7960fff8d86424b3db67d50cd9': 'Spandex - Atomic Components',  // Emphasis=Tertiary, Size=Large, isOutlined=False, isFloating=False
  'c36ffb44aa01a1d223d60248c793caa3c1070172': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Large, isOutlined=False, isFloating=True
  '37562a54471ff83cb83a42f7c35f639c20e52c45': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Large, isOutlined=True, isFloating=False
  'cb87447570c89b06745679dfcc4907ed03278f26': 'Spandex - Atomic Components',  // Emphasis=Secondary, Size=Large, isOutlined=False, isFloating=False
  'a055fd9ba3fc8eccad23d2fda4227c05f9cd9cbe': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Large, isOutlined=False, isFloating=True
  'feba95292dc30279acbb3ec391fc6bce86e4c1c3': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Large, isOutlined=True, isFloating=False
  'b54cf0b6a642f6facde9ace5b7e318fafb09ca13': 'Spandex - Atomic Components',  // Emphasis=Primary, Size=Large, isOutlined=False, isFloating=False
  '96fbc94888f794dadf8b76ee90c86bba67b58277': 'Spandex - Atomic Components',  // mediaPosition=↑ Top, isSmall=false, State=Default
  '0d2569afe6cbce08e05c9557e7179c3e6d51ecf0': 'Spandex - Atomic Components',  // mediaPosition=↑ Top, isSmall=false, State=Loading
  '76df6fdbe7b4758ff5a8b44f857127339c94dc51': 'Spandex - Atomic Components',  // mediaPosition=↑ Top, isSmall=true, State=Default
  'f048edf7ca20c7ce194ad392fae3a335e6a65b3b': 'Spandex - Atomic Components',  // mediaPosition=↑ Top, isSmall=true, State=Loading
  'f364488c461a8e66db9fa72002443e63de950b4f': 'Spandex - Atomic Components',  // mediaPosition=← Left, isSmall=false, State=Default
  '693dfabc0fc3ee7110fbb41d1855293a8e2cffa8': 'Spandex - Atomic Components',  // mediaPosition=← Left, isSmall=false, State=Loading
  '2a0a514a44410e539783d0fdfe7d059f806244d4': 'Spandex - Atomic Components',  // mediaPosition=↑ Top, State=Default
  '6327b2bbeb382fa98a3a0d50599e5ae65bef9cf2': 'Spandex - Atomic Components',  // mediaPosition=↓ Bottom, State=Default
  '3771e69a4b2ad7f653cead0e5e537d80d216462a': 'Spandex - Atomic Components',  // mediaPosition=↑ Top, State=Loading
  '55f49daad13d7bc7f6c26c022e8b2eafac1012a7': 'Spandex - Atomic Components',  // mediaPosition=↓ Bottom, State=Loading
  '66b7fff9aaac4f6b6847610f245eccafc4ced7de': 'Spandex - Atomic Components',  // mediaPosition=✖️ None, State=Default
  '22f79785ec33477ff3e82d9a65ef15ca73ce3c55': 'Spandex - Atomic Components',  // mediaPosition=✖️ None, State=Loading
  '476bfe62b7f2758a46a2c541fc53b10599e00f98': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=false
  '5f5931096591e0582651c56863cf0652d1888145': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=true
  '25df2d44bb7462a2b3a623dfc1f51317ff590c9c': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=false
  'a45734d30d14b1c9b0cad179beb3c8b53c0e1ac8': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=true
  '502d46f80cbe7db149ee9af4fb840624356ec771': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=false
  '11385767d90782cb9214ef88ba53d41ccd7ba359': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=true
  '3bf3d970655f31f6fea1365e298a3821ecabcf16': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=false
  '046b4f04b9ad3d62b0df55bff2b54ea4afa0422b': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=true
  '1aa4ebbd5a8f3a5eb698aaea684d1ee8a1500fa9': 'Spandex - Atomic Components',  // ↪︎ Action=Dropdown
  '8b0cbf6193ab386897abd58e2d1dfab8232b0b6a': 'Spandex - Atomic Components',  // ↪︎ Action=Close
  'a3b6f612fde59c18f961b90065b48d3b02a08895': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, actionType=None,isDisabled=False
  'eb338278f78e9e47d9d13322098d1c8823e57dcb': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, actionType=Closeable,isDisabled=False
  '35d373df2a95375bdd943f516669d91805e70f0a': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, actionType=Dropdown,isDisabled=False
  '412d4cf6ad4eb9668394f8e8353921ec68b9ebc3': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, actionType=None,isDisabled=False
  '9952b121f465bf6dbe0b42664ad8b8c05a57d4dc': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, actionType=Closeable,isDisabled=False
  'fefc2cd367750681ea4a9c9da2c47fb3290388d0': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, actionType=Dropdown,isDisabled=False
  'b1f69b74e63e0502895beff5450a88fcb6fb84c2': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, actionType=None, isDisabled=True
  '4235619138d3a57595fca05ae292168034872338': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, actionType=Closeable, isDisabled=True
  'df70a20018806ba6f7aaeddcbd56fdb4734fcc9e': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, actionType=Dropdown, isDisabled=True
  '748a507b84609ec6e3566d5e4b5692c3fb5ab5d8': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, actionType=None, isDisabled=True
  '049a74949f8088c4375b4adf74bfef429368e3cd': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, actionType=Closeable, isDisabled=True
  '3436ccb69516bd48aa03a7d7b87b07f35585cbf7': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, actionType=Dropdown, isDisabled=True
  '569b1f4ce4e1b11f53edf9751ae07ba0aa0dde28': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, actionType=None,isDisabled=False
  '2ca507873bd3e560fdd6fb1112bc53655ac02322': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, actionType=Closeable,isDisabled=False
  'fbaf25eb1ff5f693944f4db9fe1f8dbf8402f56c': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, actionType=Dropdown,isDisabled=False
  '8bfeb37e5b805f5b0578c08ab870228a77c75159': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, actionType=None,isDisabled=False
  '0c487c4f2f9e76f9d964d56a7476d653124c2a04': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, actionType=Closeable,isDisabled=False
  'e6c47b752bfdc3df75b0106e97b9a44f6ea93367': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, actionType=Dropdown,isDisabled=False
  '2a88aed9790ab2c9f907755a8fb1a1af7c04739a': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, actionType=None,isDisabled=False
  'c8333d77e2a1ef0d42d0b9220144099004158dee': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, actionType=Closeable,isDisabled=False
  '80a9d3411f60fccae0ea63852ce3c6ba3867ef3a': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, actionType=Dropdown,isDisabled=False
  '2a3c2afb830520daf2e01b0d6acc47adc024d5c1': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, actionType=None,isDisabled=False
  '4ada7f72f9593df92f4959bd00b40fda8d38b8be': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, actionType=Closeable,isDisabled=False
  '96685367b8c9a4fee276745ea6853d6e662208e6': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, actionType=Dropdown,isDisabled=False
  'ce146962e1567059c38b49a85b6810c7025ecd2d': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, actionType=None,isDisabled=False
  'e24a400441cd1c0735dfef8f692a7d5db50e4447': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, actionType=Closeable,isDisabled=False
  '7c7dbee1a6beef593f494ee12485a46c2526c5e6': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, actionType=Dropdown,isDisabled=False
  '0309de57cf8de511f2e42342ca4d6274a67cbe01': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, actionType=None,isDisabled=False
  'a68182047ffb76d0fce1884d51a93234e338d984': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, actionType=Closeable,isDisabled=False
  'b3824baa3fbe48e15aff108b78bc1144b311543d': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, actionType=Dropdown,isDisabled=False
  'ba33728acb7cdf8fe21866695bb11802ab875035': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=None
  '470a0115c420ca7068ab74f0160bb637606a3c9b': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=None
  '69d699299580dea4f6689614a6591790bb8129e7': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  '6b9e93a3bbdff9e5391bcdb9c3e0e6a8fcc1f93d': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  '0877c2be0cf55108582c939085172b9103a87513': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  'fd5340720340b582164e532e0beac78d2a41d0f1': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '1f746dae5433d8b87fa37bc2b46462f872ec784d': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=None
  'bb5edf0789411423c1e0dd503025a0c194c06134': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=None
  'ec61c1a0e3e814c45ee1654d789c72dfc9c23220': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  '6870df53d5638503db565c0de60fdf81f4f8d2e7': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  '3b3823fd76b54dbdfba3eab61f7e50415eade907': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  'd4a09058536361606c736317c705012ab834bace': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '3b898c92e5ba4afa26c85b71b647f46212b3d625': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=True, hasleadingIcon=False, actionType=None
  'd369fb5a4bb864b9704c30cc9c5d078628e5d20d': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=True, hasleadingIcon=True, actionType=None
  '8ed562c2f8b9c97e4848e7bf2a4bd87846c849c7': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=True, hasleadingIcon=False, actionType=Closeable
  '1706052be0d7af0451756ff8bd2400b586dac3d7': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=True, hasleadingIcon=True, actionType=Closeable
  '8b58cce2967bb1b68b454294e665b509dab108ea': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=True, hasleadingIcon=False, actionType=Dropdown
  '0c857e66725d661c2dce2d8c208a3ce0d24efd07': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=False, isDisabled=True, hasleadingIcon=True, actionType=Dropdown
  'f4ef0e7288960ececfafd97c4de943669c6fb57b': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=True, hasleadingIcon=False, actionType=None
  '6caff1e534370f9a94c1a1278be831a1f5d500cf': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=True, hasleadingIcon=True, actionType=None
  'cabda7df203b79011d58f9fb95a61ddac35c19a7': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=True, hasleadingIcon=False, actionType=Closeable
  'b9b5d2a571b6547b1ddb06ef81005b1eaf93f7c8': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=True, hasleadingIcon=True, actionType=Closeable
  '9a18d1a103f50ca6a14866c05153083f4331ee0b': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=True, hasleadingIcon=False, actionType=Dropdown
  '1e57014fc90e4bf5a3952ff7cacb1c465543aede': 'Spandex - Atomic Components',  // isSelected=False, isPressed=False, isFloating=True, isDisabled=True, hasleadingIcon=True, actionType=Dropdown
  'd2e6e4e4b7a7db688d6eda371d390155e0c6c68f': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=None
  '70b2c8cdf847e0c8999d0c4925ec75125a273b90': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=None
  'b8273428a33aa9b18dba14112a4f36904cc32985': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  '1d057a58e518069a66a4672e0236f46ad6e6b26f': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  '94293f2fb4f0c718f3d1d321befd93b80badad63': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  '370418aa0b747f252b7388454b98a6564a227f41': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  'bd75b6fd5e116b7e4478c4d0e0510c87352dc3c1': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=None
  '4312623b107f15223edbd5832f957fadc663716c': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=None
  'c088941f7c7f6797c1533702ec8ebf720e80f073': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  '9698f3963681cc04f81c598b39694bd74a50ac34': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  '05d8c03e0cc886d411bab6219147f11874b7fefa': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  '1b9332ef1a83eb8c9ab7cd27a52c196f5dfd1d7b': 'Spandex - Atomic Components',  // isSelected=False, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '81cf31708a27a364009d36afd49902af3fa483c3': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=None
  'fabc52395e7b0b1883bb9c29448741d08afc571c': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=None
  '7e02973200d6ad7709b6d3ab2ac09f218c262573': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  'e3dc2137eb18031c27696e580df85f9ea954b583': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  '6d64809a3d76852b4908f37fe595e41030e30e2e': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  '8ea1b8593e1101ff5c02cb0d777cb3a50fa40ed9': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '2ab2f00a9d1eb79172029311f34c52495e04fb0d': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=None
  '081be1ffe455ebc2d691e7d36b1df1cadf163373': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=None
  'dc2d1b6f9a58a8d0dd3d19ff4d8943b82f9dd6f6': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  '17dea4e7ec443094bd328e6862183075ff9ed82c': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  'd707d3b052a0e85e557acf028e5211b183dba629': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  'd343fcaddf38bcc501f9d05275778b730ae95b7c': 'Spandex - Atomic Components',  // isSelected=True, isPressed=False, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '5e9e9fa8f954539c706ae815115b66f4f17a2243': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=None
  'ce82be26819bd10b8e401881f4ebc800f3849a94': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=None
  'ac58c92ae697a2c5dc6eaeba9effd1779c0a5af8': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  'ebb84b6d0e12231b29079441f40b60fc9707fa4c': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  'ba76df7bf2e6e1264b567f0fd09fa2f9b24e27a3': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  'b34bc13effdbf7586544a92ed7aec2fce5375810': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=False, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '67eff2a3a162e1aa92261151db9ce06d2c67e0eb': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=None
  '326a87eb7d67b1c9a5769b37119176b4f4ae2d7e': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=None
  '6e4e332ddde7c283600257ad6e9ffc555c0eb98d': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Closeable
  '469d08cfea684362fe790b6fc4d1a095998c9a68': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Closeable
  '5d055d4e56cebb003d5e427012f334125c470051': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=False, actionType=Dropdown
  '2ea0c494e17ffd1c2614e8f1aeafa206c447e349': 'Spandex - Atomic Components',  // isSelected=True, isPressed=True, isFloating=True, isDisabled=False, hasleadingIcon=True, actionType=Dropdown
  '5a03564ce7614c71ea2c8decf5210e369237d79a': 'Spandex - Atomic Components',  // pointer=none
  '35fd8a33407b95c0dfd4a7a056c09ebdca975a50': 'Spandex - Atomic Components',  // pointer=topLeft
  'e761ce7622754c8efd2d957d87c70890a4e69a8a': 'Spandex - Atomic Components',  // pointer=topCenter
  '482646b6fe4f852cc59b095c496a60decc489ea2': 'Spandex - Atomic Components',  // pointer=topRight
  '9ebe17bd0b239cfb7e1ba74572f0640d2e8b8fb7': 'Spandex - Atomic Components',  // pointer=bottomLeft
  '32bbe928e4f88b7a384f1edf53bbf4362d8462a4': 'Spandex - Atomic Components',  // pointer=bottomCenter
  '03fb8d7a3a1f39f51b57f91c23b9ad5f5bc3881e': 'Spandex - Atomic Components',  // pointer=bottomRight
  'd1866ba012549848bd2b9c69a4e90707c891ebaf': 'Spandex - Atomic Components',  // pointer=right
  '400e14c1fa171aa7d0f942ec9987af489a603fdf': 'Spandex - Atomic Components',  // pointer=left
  '1bc210755f98938e3a61c4dc9486748aab5fe710': 'Spandex - Atomic Components',  // _coachmarkTitle
  '445addc1fb88a3111a69fe0abfeca5561d2c55f4': 'Spandex - Atomic Components',  // dividerHorizontal
  'dbac368faa488cd2516adcfbf1e533a7ebb557e1': 'Spandex - Atomic Components',  // dividerVertical
  '89a946f0f339bc7b3ed6b1d9148a6579904648e2': 'Spandex - Atomic Components',  // isActive=false, isError=false, isDisabled=false, isFilled=false
  '16bf56ec2caa51d28d6e38107ea9937380a81767': 'Spandex - Atomic Components',  // isActive=true, isError=false, isDisabled=false, isFilled=false
  '44575f1ca201559655df584e523dcc9f72c5d258': 'Spandex - Atomic Components',  // isActive=false, isError=false, isDisabled=false, isFilled=true
  'febb2c9fc423697e129dddd1b812228d6f4ed474': 'Spandex - Atomic Components',  // isActive=false, isError=true, isDisabled=false, isFilled=false
  '2692c211a13278315af95a15050086ae5e571b69': 'Spandex - Atomic Components',  // isActive=false, isError=true, isDisabled=true, isFilled=false
  'f1962c29e719c208c7b513fe810a26b055651a40': 'Spandex - Atomic Components',  // isActive=false, hasError=false, isDisabled=false, isFilled=false, isCompact=false
  'dd972e61c1c86cb717ae0f11db6838139c2d2dbb': 'Spandex - Atomic Components',  // isActive=true, hasError=false, isDisabled=false, isFilled=false, isCompact=false
  'f0c368ea31c6a659026e15b9b55d531a03c69673': 'Spandex - Atomic Components',  // isActive=false, hasError=false, isDisabled=false, isFilled=true, isCompact=false
  'e94189d6d597ffdd4e03545771149ef02e79f937': 'Spandex - Atomic Components',  // isActive=false, hasError=true, isDisabled=false, isFilled=false, isCompact=false
  '8f1389398d1e1ed3140b04c87df3f1f35ab170c9': 'Spandex - Atomic Components',  // isActive=false, hasError=true, isDisabled=true, isFilled=false, isCompact=false
  '91fd3860f1edd9e75d1b0a1cd7f90c61449ca3dd': 'Spandex - Atomic Components',  // Count=1, Avatar Size=16, Text Orientation=↓
  '33aaf747a3c6082d9c2a002d8a690750eac54182': 'Spandex - Atomic Components',  // Count=2, Avatar Size=16, Text Orientation=↓
  '5213cb3e14de19b038273c474a0e03b502b4ed95': 'Spandex - Atomic Components',  // Count=3, Avatar Size=16, Text Orientation=↓
  '250b35f867824ea8748cedadcdfffe11f9f2449f': 'Spandex - Atomic Components',  // Count=4+, Avatar Size=16, Text Orientation=↓
  '412766aeac4ea5e2a825abfe0ea03e0e9c76b4e3': 'Spandex - Atomic Components',  // Count=1, Avatar Size=16, Text Orientation=->
  'c405e4a5a645599bad86bb5f94d55751ce5f68aa': 'Spandex - Atomic Components',  // Count=2, Avatar Size=16, Text Orientation=->
  'e6d8cdc17625373e25b5814d5b57a708a47e8ef4': 'Spandex - Atomic Components',  // Count=3, Avatar Size=16, Text Orientation=->
  'f32b7258ea78c1068969db2d6890bd64f3697969': 'Spandex - Atomic Components',  // Count=4+, Avatar Size=16, Text Orientation=->
  '0780f83819e5880254acddabfc6f36f649af231d': 'Spandex - Atomic Components',  // Count=1, Avatar Size=24, Text Orientation=↓
  '1e3ef7518179edbfa2eba058b488ca0cf19eeb21': 'Spandex - Atomic Components',  // Count=2, Avatar Size=24, Text Orientation=↓
  '6fb9fae2b58d85f2de3d63541db52960d550204c': 'Spandex - Atomic Components',  // Count=3, Avatar Size=24, Text Orientation=↓
  '1e310030f289ea6037c153ebd686e51450945a07': 'Spandex - Atomic Components',  // Count=4+, Avatar Size=24, Text Orientation=↓
  'ef79034d27a341e6453b0cbda3b06ec5220f858e': 'Spandex - Atomic Components',  // Count=1, Avatar Size=24, Text Orientation=->
  '6c3b10cd2ea0babd0b3f06172bc1164f199b6c6e': 'Spandex - Atomic Components',  // Count=2, Avatar Size=24, Text Orientation=->
  '04bdc77819ec0772aacfd59a60952938af31b324': 'Spandex - Atomic Components',  // Count=3, Avatar Size=24, Text Orientation=->
  '375873b29fe9406dbd3abf7e0fb6a7734e47b9ab': 'Spandex - Atomic Components',  // Count=4+, Avatar Size=24, Text Orientation=->
  'be04ecb28bba10cc965efc8746ab0fddb7dbeb11': 'Spandex - Atomic Components',  // Count=1, Avatar Size=32, Text Orientation=↓
  '3d433bc7dcd0003af30f65532e8c32768f9894f2': 'Spandex - Atomic Components',  // Count=2, Avatar Size=32, Text Orientation=↓
  '5920343c46a19227c38415e9b0465f544d3c2453': 'Spandex - Atomic Components',  // Count=3, Avatar Size=32, Text Orientation=↓
  '0a4e4b35524877ccd77aa59610c99722ffe45264': 'Spandex - Atomic Components',  // Count=4+, Avatar Size=32, Text Orientation=↓
  '4614deb7cf2e66e6d0ccefbb866d2596dd1247a4': 'Spandex - Atomic Components',  // Count=1, Avatar Size=32, Text Orientation=->
  'b4b839ae88668935d7edd0a6f85de381d949f30b': 'Spandex - Atomic Components',  // Count=2, Avatar Size=32, Text Orientation=->
  '44d8a98c6fa04add7def4f28414f2e012efcb729': 'Spandex - Atomic Components',  // Count=3, Avatar Size=32, Text Orientation=->
  '1607fc98e1fb79163be3c93572c87adaa5ee2e92': 'Spandex - Atomic Components',  // Count=4+, Avatar Size=32, Text Orientation=->
  '1e73b348e92678fbc1ccfc736a7995e4118781ce': 'Spandex - Atomic Components',  // _Avatar Group
  'd9131a164338dd9bfffd2a75ef73c2ac4f946ae5': 'Spandex - Atomic Components',  // itemCount=2, itemSpacing=Default
  '8e3e301e83265985f5fc0330e380911eb18f7c2f': 'Spandex - Atomic Components',  // itemCount=3, itemSpacing=Default
  'a58509c9e2c51d214a2d1eddb8d550894ce10d0f': 'Spandex - Atomic Components',  // itemCount=4*, itemSpacing=Default
  '318fe4661e6ac52dcc169b3fc5cdf1daa5a79460': 'Spandex - Atomic Components',  // itemCount=5, itemSpacing=Default
  '504d11cc3b290021b392e91f0eef6e0cacadb2ae': 'Spandex - Atomic Components',  // itemCount=7, itemSpacing=Default
  'f8f568e0c201aaffcfabeacad0a0f08b0b0a9e11': 'Spandex - Atomic Components',  // itemCount=2, itemSpacing=Compact
  '54b46c3054cdbd1a7a3015d769afb3bf58dd5435': 'Spandex - Atomic Components',  // itemCount=3, itemSpacing=Compact
  'cb4235bfa731b9f09fb133f9b881030ac649c59a': 'Spandex - Atomic Components',  // itemCount=4*, itemSpacing=Compact
  '2312f6f389c54c8c2d2d6842d9298d1b9e98e53c': 'Spandex - Atomic Components',  // itemCount=5, itemSpacing=Compact
  'ff141fac94fb65a73474b59deca0c213f785d87b': 'Spandex - Atomic Components',  // itemCount=7, itemSpacing=Compact
  '3c64049a02ece901b6f4e324c41dfb46b1bb8eeb': 'Spandex - Atomic Components',  // itemCount=2, itemSpacing=Spacious
  '73bfd6fb3cdef9cf41c0bfcfd45ce4254f308dfd': 'Spandex - Atomic Components',  // itemCount=3, itemSpacing=Spacious
  '1b0c7ebed0c85abc1c70624a3c8e86265d89c54f': 'Spandex - Atomic Components',  // itemCount=4*, itemSpacing=Spacious
  '285c1a9bc8e3697f2ea5e19107e88ae4c08f34e2': 'Spandex - Atomic Components',  // itemCount=5, itemSpacing=Spacious
  '472aa8899e45c8bc925f969a8eb5c761d3558c2d': 'Spandex - Atomic Components',  // itemCount=7, itemSpacing=Spacious
  'e5852677f806189b72d6d387cf8420292fae0f23': 'Spandex - Atomic Components',  // .iconListItem
  '196443457ba5fd417243f5f8fbbffc7ab803266d': 'Spandex - Atomic Components',  // State=Default, Runna?=False, isElevated?=False
  '31419871374f1846a1f613d0909e9ccbf651fb03': 'Spandex - Atomic Components',  // State=Default, Runna?=False, isElevated?=True
  '41664df3e35115c4a07ce14e8640b2c367c388b4': 'Spandex - Atomic Components',  // State=Pressed, Runna?=False, isElevated?=False
  '89a8f73c565866d967f29c022f26e8f51dfc95c7': 'Spandex - Atomic Components',  // State=Pressed, Runna?=False, isElevated?=True
  '4ab937074246006c9c6a79158c629d7549a54ee4': 'Spandex - Atomic Components',  // State=Loading, Runna?=False, isElevated?=False
  '417bbfb5ff8ad0f6ffb3a1a75c08494efa460936': 'Spandex - Atomic Components',  // State=Loading, Runna?=False, isElevated?=True
  'b0ca99983b23941f06177347206ae114452b8a82': 'Spandex - Atomic Components',  // State=Default, Runna?=True, isElevated?=False
  '504c3a87a629b69fd0d68ddd67658203b3c356da': 'Spandex - Atomic Components',  // State=Default, Runna?=True, isElevated?=True
  '2e6bd73e3b76b275bcd9f62168e0042b9eb80386': 'Spandex - Atomic Components',  // State=Pressed, Runna?=True, isElevated?=False
  '583214e9b263f9247db4a24f05eb135a2b59cd30': 'Spandex - Atomic Components',  // State=Pressed, Runna?=True, isElevated?=True
  '981bf48994b94edfffaa9e31f11da1f2c0d228c6': 'Spandex - Atomic Components',  // State=Default, isElevated?=False, Type=Default
  '7eda8594182cc2d49002844df9debf945db35814': 'Spandex - Atomic Components',  // State=Default, isElevated?=True, Type=Default
  'be42c812ed7460386c342a06628d915eb476b980': 'Spandex - Atomic Components',  // State=Pressed, isElevated?=False, Type=Default
  'c49c2d8c4b01229834a76a76f1a267174c650c11': 'Spandex - Atomic Components',  // State=Pressed, isElevated?=True, Type=Default
  '5e47f1102b6748203b45bdbcfb0ecd525b0c9983': 'Spandex - Atomic Components',  // State=Loading, isElevated?=False, Type=Default
  '1c5ae6e856a577390ab85c6098a31d4e08be602f': 'Spandex - Atomic Components',  // State=Loading, isElevated?=True, Type=Default
  '11d42e62ea53d70cfcf59981d159df8683c4ee21': 'Spandex - Atomic Components',  // State=Default, isElevated?=False, Type=Runna
  '2bdd82e6c71e691c09fcb464735326948b7c5d35': 'Spandex - Atomic Components',  // State=Default, isElevated?=True, Type=Runna
  '34ca316e3f0a2bc9ca9206da14289131f6168b1d': 'Spandex - Atomic Components',  // State=Pressed, isElevated?=False, Type=Runna
  'a83f7b730aa9566f38826a209de1a2292bded14c': 'Spandex - Atomic Components',  // State=Pressed, isElevated?=True, Type=Runna
  '7ba702df67c83f0890ed5643bf1185419d83ad4e': 'Spandex - Atomic Components',  // State=Default, isElevated?=False, Type=Subs
  'f1eab45f41923037ebecf3b3952eaeb430e69232': 'Spandex - Atomic Components',  // State=Default, isElevated?=True, Type=Subs
  '104c3f9825d7924a27bbc350d8448300372b94f6': 'Spandex - Atomic Components',  // State=Pressed, isElevated?=False, Type=Subs
  'b9dbc3155320db481def77800886df19373ab239': 'Spandex - Atomic Components',  // State=Pressed, isElevated?=True, Type=Subs
  'f78bfe2cfdce31ad0b65de7df2ceaa94421115bd': 'Spandex - Atomic Components',  // Type=Default, State=Default, isElevated?=False
  'e9a8cd1849f7a4a3806160f991000b893ef1e5ff': 'Spandex - Atomic Components',  // Type=Default, State=Default, isElevated?=True
  'c5eec7d2ff642bb8c005b71e6a5d5a35402fc53a': 'Spandex - Atomic Components',  // Type=Default, State=Pressed, isElevated?=False
  '6ecf59e937cbc6db6082404fdc3c45355e374261': 'Spandex - Atomic Components',  // Type=Default, State=Pressed, isElevated?=True
  '1afaa551f1506379e20916dbbeb032fc3c36c917': 'Spandex - Atomic Components',  // Type=Default, State=Loading, isElevated?=False
  '1236a170b8c9a710fbd1edfb1f3c17e7778e9746': 'Spandex - Atomic Components',  // Type=Default, State=Loading, isElevated?=True
  '156fe7d2d1567a3359a4802f46761a6c67e9789c': 'Spandex - Atomic Components',  // Type=Runna, State=Default, isElevated?=False
  'b768b5deb15cb709efb64249493d228f9ede4766': 'Spandex - Atomic Components',  // Type=Runna, State=Default, isElevated?=True
  'e7d034623e71af74b904e535be2cbfb48dc98386': 'Spandex - Atomic Components',  // Type=Runna, State=Pressed, isElevated?=False
  '7bb7def5caf2dc12be5067064f7c3a9874084913': 'Spandex - Atomic Components',  // Type=Runna, State=Pressed, isElevated?=True
  '65a12e260e1c804b8ddb684b31a5bd352b3b4c37': 'Spandex - Atomic Components',  // Type=Runna, State=Loading, isElevated?=False
  '24903799373cc52401ff9513ee16847d35d49ddf': 'Spandex - Atomic Components',  // Type=Runna, State=Loading, isElevated?=True
  'f2785960f271f82bdb887eafe9fecc5d062cffe1': 'Spandex - Atomic Components',  // Type=Subs, State=Default, isElevated?=False
  '31eb07443176111206b2377e9c18a11724336802': 'Spandex - Atomic Components',  // Type=Subs, State=Default, isElevated?=True
  '2a20557cf14e40c6ea14d867705f7b50c50751cc': 'Spandex - Atomic Components',  // Type=Subs, State=Pressed, isElevated?=False
  '7f9f43c79648a85a019c9a578c8c4f282af6803f': 'Spandex - Atomic Components',  // Type=Subs, State=Pressed, isElevated?=True
  '19b7954e69f80ae4fd1b6dbbb822c5392a3eafd5': 'Spandex - Atomic Components',  // Type=Subs, State=Loading, isElevated?=False
  'f85ae2795928864242d4e45cc8d06950682e9e29': 'Spandex - Atomic Components',  // Type=Subs, State=Loading, isElevated?=True
  'f128dda4722ec6ff9bcfafe397a63e1ad5349dcb': 'Spandex - Atomic Components',  // Type=Primary
  '1a4b20f9442cedc7a1d461692e3233b0fef80df3': 'Spandex - Atomic Components',  // Type=Error
  '5855ae989a391b1941ec3ee3818e2e8da3d1b572': 'Spandex - Atomic Components',  // Type=Success
  '138e0c5c84e04bc84cf8e5a57ab473795b1604bd': 'Spandex - Atomic Components',  // Type=Attention
  '2ad0e34538a93ddc93e4aa053ebad408b64a4e86': 'Spandex - Atomic Components',  // Type=Minimal
  '8d21e0437655bfe1632595634399d8417f1df6d6': 'Spandex - Atomic Components',  // Anchor=none
  '9b7241eda42b2f91f563b28f7141b93e6e55dc1a': 'Spandex - Atomic Components',  // Anchor=↑ Top
  '2e24db14471c94ebbcdc918f706a8381f3f26a29': 'Spandex - Atomic Components',  // Anchor=-> Right
  'fb56fa2d965021baf768b58345d65de00df37ae4': 'Spandex - Atomic Components',  // Anchor=<- Left
  '7ba117e121e6c2b1a514052898f4ddbf0c4b5250': 'Spandex - Atomic Components',  // Anchor=↓ Bottom
  '48f8d71ba0fbffc0b15a5984f0f2259218bb9bd0': 'Spandex - Atomic Components',  // Anchor=none
  '521a7ec2a848b340fb21b962854b1a1028e199bb': 'Spandex - Atomic Components',  // Anchor=↑ Top
  'c0a0a01bc76cbcb65182defe2459f75fa40f4d9e': 'Spandex - Atomic Components',  // Anchor=-> Right
  '3f4ddcd191bbce8db14ae7ed9160bd3642c364ad': 'Spandex - Atomic Components',  // Anchor=<- Left
  'dd554aafc18528dcb6cd69723432575e3f05c298': 'Spandex - Atomic Components',  // Anchor=↓ Bottom
  '3926d900af5ffae6d07bfd570f9d2ff95970ba69': 'Spandex - Atomic Components',  // Width=2px
  'de26c750480b99fc73804dabd8974d6667428f3b': 'Spandex - Atomic Components',  // Width=Animation Stop (don't use)
  '09a8055904f0a43c362aa426e96feae3b8211753': 'Spandex - Atomic Components',  // Width=1px
  '7cadeae00ee9ca95732430c5089d003a0d7090d8': 'Spandex - Atomic Components',  // isIOS=true, isAndroid=false
  '63f20151ef5e442f7463d1bb9ec50eb1ed0b03ba': 'Spandex - Atomic Components',  // isIOS=false, isAndroid=true
  'c229e6487efdcaf0facd52b5717cb467110b17de': 'Spandex - Atomic Components',  // anim=start
  '4746965eb7290c75e6f82d3945f5ba9414347e3a': 'Spandex - Atomic Components',  // anim=end
  '95750cf81afaa5b53de3aa5810befe0459f6a0d3': 'Spandex - Atomic Components',  // State=Default, hasCalendar=False
  '98737825d6d3d93b5e4c224693c7cbe6a41ff6a6': 'Spandex - Atomic Components',  // State=Default, hasCalendar=True
  '6f0d2868426ada13205cec014a104ab5f6d76419': 'Spandex - Atomic Components',  // State=Loading, hasCalendar=False
  'dcb8a9524ccf81d6f2542f9ba0829ced0916d5b1': 'Spandex - Atomic Components',  // State=Loading, hasCalendar=True
  '5fb2eca6f098185330f527da915f9c3e8b482339': 'Spandex - Atomic Components',  // Size=40pt, segments=continuous
  '5c023b2e7bea770436d75b9e5d167468749a9504': 'Spandex - Atomic Components',  // Size=54pt, segments=continuous
  '871d45d28ef259bcd7a38f2051a4739ce9835229': 'Spandex - Atomic Components',  // Size=60pt, segments=continuous
  '24aac9eda29b41dfa338d93a9473a2ecdff76c21': 'Spandex - Atomic Components',  // Size=40pt, segments=two
  'cc41e0659904c620155dcd0c96e249900672a331': 'Spandex - Atomic Components',  // Size=54pt, segments=two
  '27541181fb22ff0633bffe751ac7500f4898055e': 'Spandex - Atomic Components',  // Size=60pt, segments=two
  'fd1769248964cef3d54ab08f8adad7f5898b1ced': 'Spandex - Atomic Components',  // Size=40pt, segments=four
  '1b82c9e5ad7934a9408e1b8f6010176878fd6f43': 'Spandex - Atomic Components',  // Size=54pt, segments=four
  '287afa10ddb4515931593e171aab0768b3de2005': 'Spandex - Atomic Components',  // Size=60pt, segments=four
  '967d03dbc6dfb6d563820c21d64d5c3757c9b195': 'Spandex - Atomic Components',  // Size=40pt, segments=eight
  '09160bb73f37c564318d65453c9890cd85b9676c': 'Spandex - Atomic Components',  // Size=54pt, segments=eight
  '7c2c77267cd7e10a620d884ffdf00207fa44161d': 'Spandex - Atomic Components',  // Size=60pt, segments=eight
  '42b3bd003bf4520a24e8a2da0bcc94e524ea2fd7': 'Spandex - Atomic Components',  // Size=40pt, segments=max (31)
  '1f8c8f287b8d7485120cf1406e3d9a92ddbda58e': 'Spandex - Atomic Components',  // Size=54pt, segments=max (31)
  '69c4d995943813bc8b39f6ad7609344464a04429': 'Spandex - Atomic Components',  // Size=60pt, segments=max (31)
  '6546c1a0d2cc2e9fa31086ac0c8ec6520f81fcb6': 'Spandex - Atomic Components',  // Count=1 segment
  '7c18ec5447272d5169c55020fd20f2cba7a9ba4a': 'Spandex - Atomic Components',  // Count=2 segments
  '5660bcddf07ebe64a5a58b52ea057c66c5b9fef4': 'Spandex - Atomic Components',  // Count=3 segments
  '213635b427ec54fb23224d4ce5b37edd8cddc39b': 'Spandex - Atomic Components',  // Count=4 segments
  'c08eb769770a62541e919ebe9d4547111f69f89c': 'Spandex - Atomic Components',  // Count=5 segments
  '78eb42a711f9be2b2f210be57c16b9cd665dab40': 'Spandex - Atomic Components',  // Count=6 segments
  'd3503812828637a6d7658ccb8304a1619e4be266': 'Spandex - Atomic Components',  // Count=7 segments
  '2778c77fcc12ca750337960dc24f826ed7921cbd': 'Spandex - Atomic Components',  // Count=8 segments
  '187544b2afd13de47bbc89ff3d9fa211d97c6617': 'Spandex - Atomic Components',  // Count=9 segments
  '5f5279010ad8295f485c83e9d9e125f22441c4de': 'Spandex - Atomic Components',  // Count=10 segments
  '1ec44e780fd64f8f2b70c644bb7ead6aa8d36f90': 'Spandex - Atomic Components',  // Count=complete
  '997415fc89a28c2421af31bb89f28b184ab65311': 'Spandex - Atomic Components',  // Count=custom
  'd14d6f2816fd834f51f9a6f3d62061116676b097': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=false
  '05738d6c3c342aa12972cbefb3a26c0af73e2c47': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=true
  'd2931808da61f42bf224bbdd89bc40798d3ab838': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=false
  'd7c34f925894569a27cf092b4e6717f8ea7a57e2': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=true
  'c0be0647dd5bf9121ef0eeea71fcce38abebddb1': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=false
  '7b0074a3fe61f1745d0d7bb76abf2246c6649494': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=true
  'a6ffacc07e0677d74bc453892a8d288a945dd551': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=false
  '5d979a1ba0f0605c2889fc08fd469a218065a362': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=true
  '656645914f18230d3e004e5089b77427d67188df': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=Icon, Show overline=True, Show supporting text=False
  'ec6c30d3466fc987c89790d34a5bf2f2ec036b19': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=None, Show overline=True, Show supporting text=False
  '01ecc275f453080f94fb2814b3bea8a0d327cb65': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=True, Show supporting text=True
  '0accfb001683ad77dce17cf35ca7d3dbe8bcbf65': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=True, Show supporting text=True
  '526c8493d0df1115773424c579a8d3b91dfd5c15': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=True, Show supporting text=False
  '08c7faf32b3eef7ac3fb9be15f80793e5a5ec8aa': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=True, Show supporting text=False
  '33fab9652ff7737054fa168cb60b43045ec96f2a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=False
  '230671f0589fa19965f39657ecd69a5a7fe4c9ad': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=False
  '103fa6e27927c6b9bea2203d859f0fb7cf9cc85a': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=Icon, Show overline=True, Show supporting text=False
  '7653ba4877ac02de434ab8e26c77a1734094a2b5': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=None, Show overline=True, Show supporting text=False
  'dfbffceb06d2a7e74ddf352e276fb05a489e068e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=True, Show supporting text=True
  '3124d7fe02e06fd163af896524ed999865408585': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=True, Show supporting text=True
  '694a08e5b95eec502f71ffa474e55017117bb8eb': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=True, Show supporting text=False
  '3713b531dbcce99bc43b6435f5c5ce20e31a916f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=True, Show supporting text=False
  '2a901d8064dd33bd470da5947e82b8c39dde4bee': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=False
  '23806660dcb3834a6a1e4bf787af54530a0a34bd': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=False
  'e8727139530efd808fbeb5198a322f32509fa084': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=Icon, Show overline=True, Show supporting text=False
  'e5ca76661ff63ab9360e36a07b7caeee1a2f3554': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=None, Show overline=True, Show supporting text=False
  '20addd643ba5563a5e4f3ffbd59a6ecac58f0b62': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=True, Show supporting text=True
  '9957889c115dccab132a940dfd7410405a204a65': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=True, Show supporting text=True
  '30bf0ca6a414bffc9b942b8664d912eab16c15c0': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=True, Show supporting text=False
  'e2288a7c338376af9e7d33f46083fa9edd07cc10': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=True, Show supporting text=False
  'acfae67422a21d650da8922c4bbbbe8c53b519c3': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=False
  '50584a6ac229b42b958e6c666322ad3cdd7890f7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=False
  'b487c2812d90c9579dc472d007434e1740f7aed8': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '06cdb61cc14a4818ada4380bc8cf5b7d5e0fca4c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Switch, Show overline=True, Show supporting text=False
  'ab0c0f125a8262db9e21526d787ef4422dc6e971': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Icon, Show overline=True, Show supporting text=False
  'c91ee45a2325b7d219d83885a31e6b9cc1881181': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Check Box, Show overline=True, Show supporting text=False
  'd8397da26db0dc44d6366645955b8a705de00e96': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=None, Show overline=True, Show supporting text=False
  'f97d991b9669027656cce37dc75a1b38ff074bc4': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '1f36916e262af357a66d56409fbdbd39996599f9': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=True, Show supporting text=True
  '54426e268d6b69242a49a737651d7ffc7b6e17b8': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=True, Show supporting text=True
  '24e56ea1aeaa8b77649222e229ca983b077c9830': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=True, Show supporting text=True
  '4fc5dfa8c31ed4e33b983aee11472eec0c5d1831': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=True, Show supporting text=True
  '28d6052b6a800aacf5af87bd233268635c31daf3': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=True, Show supporting text=False
  'c3a22f317f86f4fa70089b83136d23c52ddfdd9b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=True, Show supporting text=False
  '97a048ede806c86b2a1b491819772003a39a7b9c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=True, Show supporting text=False
  '222bf2a35179c2081ee641de47205200384ea1b4': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=True, Show supporting text=False
  '5ccd531968b4a3ec5dcae2a23dc2cc0519f2d7f6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=True, Show supporting text=False
  'b9b19bf068d4d26d9e52c473b88af651f371dcb9': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '98e68c7890c6c40aa2f49de37043c9e79cff6ff7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=False
  'f8de998d40625ee067746bb34fe7a25b22b6b1a8': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=False
  '06e068661ba81a920b644fbd937a22ac14aeb472': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=False
  '79661c1fbda3d5c21b8a1bb3bffe5bf4cbeff7e6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=False, Show supporting text=False
  'c8c5bc7b67cb588bc9f12cfd6714a41ec5f3d48b': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '67e23e40233066c2000e6f0c67cc15b764de15a4': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Switch, Show overline=True, Show supporting text=False
  '5d31683ef6db323c645fafb90362e6226d69d938': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Icon, Show overline=True, Show supporting text=False
  '9dc108578342365776fd36ec930fd9ec49ad8306': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Check Box, Show overline=True, Show supporting text=False
  '5a7513ad56dc6904a4935738cc3fe5bd2989d0db': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=None, Show overline=True, Show supporting text=False
  'c7cbe059c7d86519e8bf42626faf0b98b69bf8d1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=True, Show supporting text=True
  'b75c1e32d0b494f2e6ad3e58d6f923615838964d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=True, Show supporting text=True
  '6f6daa75061e67cbe154d856708b2ef220264333': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=True, Show supporting text=True
  'b76e876661facf64f8fbe10b2c02eb07d7a4a894': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=True, Show supporting text=True
  '83b20ccb9959020748205891ce5230c52030c316': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=True, Show supporting text=True
  '9942a925f62ae5c0d1f83352c4e6407b8411d2f1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '9c8d19385c7add5dc4b5b7912703810df306dbc6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=True, Show supporting text=False
  '06d5edfe473d187808e3530b574f53c4a055830d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=True, Show supporting text=False
  '662013c350b9c041dc8bef2189e1a6fa774fc24b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=True, Show supporting text=False
  'a411325debd5681a017c07780c1d149589081df5': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=True, Show supporting text=False
  'e6330bb60f53bd693ce696e7faf89472c46965d1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'b20897147cff32c4953713332889b64f2c536239': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=False, Show supporting text=False
  'c4d47d90dd7a4087e22651206c7c74668f023891': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=False, Show supporting text=False
  'a7afed271c66a5a39b676e2414407e2ceda58628': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=False, Show supporting text=False
  '45be795d211897a77fa2b53738685f74e6bd7317': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=False, Show supporting text=False
  'f5b63e53bf308d77c3918583c6bb333b6e8b343d': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '6aeb00c1328e5bfbc0a787feed9928f0a7d84579': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Switch, Show overline=True, Show supporting text=False
  '8f214054f7e7fcf9148c381b6770c4bbe405bfeb': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Icon, Show overline=True, Show supporting text=False
  '54d9f4fc0af6525cd425850aa4b4b286fdb151a4': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Check Box, Show overline=True, Show supporting text=False
  'c0b466aa75c23a64e8317348a625d0de154a4fd6': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=None, Show overline=True, Show supporting text=False
  '626e77eb60c36786d5ea0b0d521580aeb2df286f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=True, Show supporting text=True
  'b34cc199d0097f403c9ad325b1c636b5d1ae97d4': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=True, Show supporting text=True
  'ca76a0ce8631c364cb26a00a8bc870799cf3725f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=True, Show supporting text=True
  '4f2e4b7079431400900fbe420e713aa7cd51656d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=True, Show supporting text=True
  '404625ccf5a699d9aa7e9ab65e1af99aca014c27': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=True, Show supporting text=True
  '8366cd675a2b015002fe376f9eb4928ef1c2fae1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=True, Show supporting text=False
  'c821e5783dd286ec0ac04ad925ca979b78663bbf': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=True, Show supporting text=False
  'f826c2f8417a702d7f6d8b08baf08cd3cf64927d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=True, Show supporting text=False
  '881f164dc121ce82325278957cccb2cfa43acffd': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=True, Show supporting text=False
  'eb64171b8637123c351dcc78a5766f83932a057c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=True, Show supporting text=False
  'f2aeee570ccf37a5f64a36e30c3e407ff24be9d1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'fea5f11e2505b7ac8d10f6b25d2cc774415645ce': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=False
  'c4342a6b6a21917f92266f432724b7e6328edeb1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=False
  '55e94f384810c5396966d123e34d30af3936a793': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=False
  'd6b279aa9e8cf4aea8a527330cef44a132b09b81': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=False
  '783cd48e32a80d7ac220952f392a69bc4d5a263c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '72ce0f6c5c1d6479d8ecb9852ef11c3e47d1a523': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Switch, Show overline=True, Show supporting text=False
  'd8bccc42a0e78eb63158ed723ca8e42ee7c19a32': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Icon, Show overline=True, Show supporting text=False
  '6f20678a35f16d8e99c69cf2feebe6284eaefdec': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Check Box, Show overline=True, Show supporting text=False
  'df6e403584343f33194141936fca2f711b3588dc': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=None, Show overline=True, Show supporting text=False
  '76f7b78d7436589ac4b6163ed72d93ddf097773c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '942026b74984c840f97948e46c23aa32eace2a4b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=True, Show supporting text=True
  'b0687cef57f12587a72d1c914692ee6dd23fa54b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=True, Show supporting text=True
  '2b9445a9bdc90224d371a920e0e111c78205ab2d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=True, Show supporting text=True
  '524f8cd2e03565dea34d38c3f0d49c2d59665024': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=True, Show supporting text=True
  'e2675a07cec5d6fea77ae501b566357c519ec48f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '0e445077774597029f091fd38292d7987fd64d77': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=True, Show supporting text=False
  '55de5eb5b6860f9b47b408412e7e59d54e1e96ae': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=True, Show supporting text=False
  '99be90fdbf6a7e14ad568863ec431ce0d774fe58': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=True, Show supporting text=False
  'c872ca23c8fb535c896447847378020d58199eab': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=True, Show supporting text=False
  '5d4aa6ba5c26ed15d67a2889bd0b2b69604ba398': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'c0a9890647e8f21bd1b240b1a280ab183a036df7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=False
  'f07d6132b1e119cb63b7321c1ef85a4ab255f37e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=False
  '1e75c767c698ed80a610c60d302944552ebb1a9e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=False
  'fb6c0fcdf8c1443f263ca731edea74e799d97af8': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=False
  'e595916faa58f856f810a7acbba5d72a0c326399': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Radio Button, Show overline=True, Show supporting text=False
  'ecb1ce5c9e90677d8d7e85982cc5e5b5c944f23e': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Switch, Show overline=True, Show supporting text=False
  'f7ccebc94b51238f8a7c5dbfd13f4fb51172395b': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Icon, Show overline=True, Show supporting text=False
  '5100eb48624e0dbf970699a6d10afdafd4ddc637': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Check Box, Show overline=True, Show supporting text=False
  '60dfa7a465496368f501ad2c66f6d42d80e54b42': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=None, Show overline=True, Show supporting text=False
  '73e35143003f9afc656ceeedf531624eef88ecc1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '5487f7052dc776d34dfa0fce65a8a6af8088d269': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=True, Show supporting text=True
  '10ffb9a09102500889860ccb3d2c232d291e0f70': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=True, Show supporting text=True
  'a8a915ae2c3ebfdb4d20a99a4229d872a876339d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=True, Show supporting text=True
  'ad35beb4704e2a4c9d01178bcedc1495ca9960eb': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=True, Show supporting text=True
  'a8e4b1b03ef04244db6cb669283032f5439e3007': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '48452890779981d0b699c02b67397e06cddddcd6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=True, Show supporting text=False
  'ee9e4461a5cdb30a7f944353af2085544af05198': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=True, Show supporting text=False
  '402c080376c69ba4436617a8c2d01798b1a84deb': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=True, Show supporting text=False
  'a7a1f7dc2472fed093d95ca30c97f5a421083f83': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=True, Show supporting text=False
  '09b290bf816d83699f5dec6478eca08319646c01': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '35038d3330cb9b5a82a57ec179956cac0ede0a46': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=False
  '5824e60e0257878d5a4449c0f2ba2712d644343a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=False
  'cc484d2785021d3cdd425695b27e78523cee4c1e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=False
  '9d8198a271b0594902404695d3bfcf4e66b9889b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=False, Show supporting text=False
  'bbf282e8defb80fade8a1598cdec92dfd86e1696': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=False
  '77e217cd7ddeee0ddcae1290c864a29dab11d347': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=False
  '654a6798e77f4232d6c2fdc3744b2c4ec15631e5': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=True
  '0694451d89e1f8fb44ad996da41f2b83777bb3e4': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=True
  '37802ed4d8c5dbde8a9b543f9785707ab6abdd79': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=True
  '70af34906cfce7f6b6ff3127dd4ca882eeea45fd': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=True
  '99dff6b4cdbae88a3853633ee7ef7fbcb6ee2ce9': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=False
  'd7434d49a7e9b373d410e077351551f04d10394a': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=False
  'a0e9a9702773423fa3db1f3d465ab2e49e817ff8': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=True
  '2cc3764d806f28dc33074408657b758fbb5c162d': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=True
  'b0e4b4cb7b79c6da3aa663f78ae6c115aed0b699': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=True
  '172be1cbf56b5e8c0d2c299cf9aecb1fd73923f9': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=True
  'c39316ef361c02cd958e83e1ec03f38410191024': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=False
  'a0fa2c29bbe67a2c4b9243432fed19719347b15a': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=False
  '44fa4a7d7a5fcc6b185bdc262403dc3dcb601177': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=True
  '83f47aafcb60ae361137f99f112ff328a65b1d82': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=True
  '061fba7c2ce059d3a3ade6e3e6893b443872566b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=True
  'a69740a52135bb941d5a393300ca12cc3805b6a7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=True
  'ef47565f4266a5452b39d142d59d09df1c21e48f': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'ac4b4d023411b3a0b8df54b29e0062bc300c7d5e': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=False
  'e725e46c56e638933b93245a9a3faca3ba5e21b0': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=False
  '4862eb1477a0369413afdbb07e25725cd96ddb7b': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=False
  '1db82e81e1cda7d272a4964615d3fc21cba53c4e': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=None, Show overline=False, Show supporting text=False
  '338497015f45ccb585005bf9d656da496a332791': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '3e291d56bfd4e6699f65b60b1cb26ea71541d953': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=True
  'b3627b2aa7f773385d6546ebb3593928f60b2328': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=True
  'dcb5541d6b9a57d8c5ef632ab84c7315d5420e41': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=True
  'a62bfd42d51bc6746a2144d286b299ef871e1701': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=None, Show overline=False, Show supporting text=True
  '027c48846bbd14e40ad73d09da5bbb73fd5ab79d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '5d0a294ff29a6c61b55dcfc838fe1b9e51853846': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=True
  'f6f6519bf57c1c824c76c9e2030d646fb86f3d0e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=True
  'e6491341b998293860296d00c0714e637e1d6476': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=True
  '4d19ab04c7e6fc80cbb84a841e09acb7efa4e23f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=False, Show supporting text=True
  'bf471378757f2abb3a15539b3ec16d62a53a8df1': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Image, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'b68483a2146d88384efa292cd02cd23c77d369e7': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Image, Trailing=Switch, Show overline=False, Show supporting text=False
  'a976f966ffb70f89f1689ec8b4b0b83dc5f33c76': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Image, Trailing=Icon, Show overline=False, Show supporting text=False
  'e403a84093b60138b24ed87a15b981c44c58adf3': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Image, Trailing=Check Box, Show overline=False, Show supporting text=False
  'a300420627ca5dc817239fe95b1d2a53c90b6a29': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Image, Trailing=None, Show overline=False, Show supporting text=False
  'e822a6d719aee92f83ab65f6bae1ea35c1d78f15': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '4cd9e58649463e656d1d40ad9f2cc7dea8b82d6c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Switch, Show overline=False, Show supporting text=True
  'c0f6a9bfebdfaf5f56255ce87bc4fe8d98f5c5fb': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Icon, Show overline=False, Show supporting text=True
  'b238debf4f835e53b3e2a65764bcf7d71e7f58ef': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=Check Box, Show overline=False, Show supporting text=True
  '1a764b7814275301ac30edbd1a6d8f26742d5654': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Image, Trailing=None, Show overline=False, Show supporting text=True
  '633dd675b5f4cd9bf644f04e9f6db63dd4ea52c7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'f547ceb40a78a6e17852635a3b76ef411d9a0c9f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=False, Show supporting text=True
  '80d761319753d09fec4e8fe0c19eb19493def6e0': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=False, Show supporting text=True
  '08f616492029d16813399051d972e5d39fec25fd': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=False, Show supporting text=True
  'aa8ca464d00794772740395bed36dc57edffbb3d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=False, Show supporting text=True
  'f4af34d03be22ff9de9c163478ad80c7f0364bcc': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'f322c076d13b0f446f154b72f537e54018e7e211': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=False
  'ff62da40626a83c7583605451b310af8c568570e': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=False
  'da8974f4a9b87fcb141cb95d9821448d2a1bfc26': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=False
  '872c5b850a95b265a42a6bd6f42649fcefcf0a19': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=False
  'bce37d30f9ed37c1268d1d6a556072a7dd5cfc60': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'b6aa8695f060e5716cd6b6d9a53d6b1b0091a52c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=True
  '766f28ac971a09661422a65e1ba8380847e478d1': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=True
  '57d8d522519bc5f323ad8c706fac847267ed275a': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=True
  '10098693377797aa89e17c7f92d991633bd14a3c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=True
  'a33b0a06c433b0b87d742ff39aa063c4a9807113': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '7c2aec8cbc5190fbe9fa7e4d88efb68d7d8a0f78': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=True
  'fdf9968ef5d1519e91a1368a661d60c8c39a259a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=True
  '104a22efc21e782ebdf6bcd06eed31671b22e3ae': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=True
  'b7f9904e778f06379894e3c66c221a2ca503b94c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=True
  '72a3957587aceb6ddb802cf2542ad0186cdb4c8e': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '74523c19c12a36004d9dd545924517ea0b04030c': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=False
  'abf363b635d236b693c7e6f06f1a7fc6051912aa': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=False
  '0de1db53e7ae8ad1e1f1a71fb30094de2918191f': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=False
  'a6b75c1c721de09a0eeb3dc97a71ad6a453bab1e': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=False
  '09d45755b0af4067a443e20069e829c3fd0d1601': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '630745207bdedec8768c9fa5cd352e53dff9b070': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=True
  '25f9c67aa39a768eb28e3331534af4cb3e3b183d': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=True
  '55e5904898a4a55b17649d96bf7fcc584d04418b': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=True
  '6f08c107075173ecee7ac2ae5ced463d0ec722a4': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=True
  'f6225aa66edc8969db0da5ff73e61f4e57852c6c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '91026f23f60c4def08faf2c6ffbf900f64ce1758': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=True
  '473255f23d7d2f36f925890f4a00fcd29d240d71': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=True
  '09ffe8085004beb4a5ff67a1376bae93737f52e3': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=True
  '3b0ce3d2e0ea040fcab963529108e75aa8d9fc28': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=True
  '9f61df0b411d10da574bb4ed78c3fb290f4a4541': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '4c03e1f203a7ac876e4b78d8cddb77d9918224ec': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=False
  'da23fe51bb103278ff8d0dc7f2e5de1bd23708ca': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=False
  '9cd36df3fcc91c9b0dd647a19bca31af2fce5a04': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=False
  'c7a2e35c8bd6be9e33e5ba4bbcc6abda00a9c925': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=None, Show overline=False, Show supporting text=False
  'e34ecf7a2da4188f33aff6543ec41997e8073c7b': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'baaa7434dca4c0dbf33710da8000ebd915b2cdff': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=True
  '3168da874b0b95ba2da59ef1dc202f3bca212a4d': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=True
  '219d035b0f2a20c39d85bda54d13afd5b7ee536f': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=True
  '522b101310d4d3e87994671f21355437890c5254': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=None, Show overline=False, Show supporting text=True
  '6eca4883a99da3889e69ec63510b1b1888fc438a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '769028ae16e5b92424a2c7e0bbe83a4c0af59d60': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=True
  '16ab3fd0edfbcfdea7c777d749e4b1b02ea32042': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=True
  'e837e0533d296da031626190af16454fc70cbfbc': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=True
  '381ee7a5c1ec7ecd707e0db16abc0fe9b2c75531': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=False, Show supporting text=True
  '57dbfe128049298f3b4bd1b0b43193f3e8d545cb': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=Icon, Show overline=True, Show supporting text=False
  '053df298e77101ae1d4c0e97fc2e110ad381efb4': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=None, Show overline=True, Show supporting text=False
  'ed8bffa5a73e6974182f19dc7cdde4632be0e998': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=True, Show supporting text=True
  '8f0ec6b69f86992df95ac04fcaee0ea6cfadad9d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=True, Show supporting text=True
  'bc902803049e8e4aae82bfffbc77d83cf4645bdf': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=True, Show supporting text=False
  '94574f67719d90dbf0a8e4bd55b58ecbb4ba1080': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=True, Show supporting text=False
  '90d3852d8e188eb85080cd2f8c32cdfc199515cc': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=False
  '2706b3f92bc7be4a6f499b7a9bdd9e4b3b4a67f3': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=False
  '0615bce07db9dbc6b04f62cc0a6076116872a81e': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=Icon, Show overline=True, Show supporting text=False
  '7c7c24f393dfd4bd82777555c6b59673017232e0': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=None, Show overline=True, Show supporting text=False
  'da35e0157afcfa78db070065b43f75ab46c312fd': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=True, Show supporting text=True
  '245ac67ffe6039b3fa57a9b3a459216633e3510c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=True, Show supporting text=True
  '74ba8fc71fc4f1a8cd79eec259e8ab7669a65b65': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=True, Show supporting text=False
  'b2fba8e79587df8d90a241e7a58f0c11f24929b2': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=True, Show supporting text=False
  '21a5afc7f60e5e4ff9769297441047c04dea092f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=False
  '32a56ce36d8ed2da930bf5004441efb1ec3e77a0': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=False
  '2131f2dbf23c50c311d45c338040f7d913ddc83b': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=Icon, Show overline=True, Show supporting text=False
  '59e3e3b3aefd76a658a6663b4e495bc9c2bb38da': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=None, Show overline=True, Show supporting text=False
  '82b2216d0cf32132fe40d9c55cfc1027121577eb': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=True, Show supporting text=True
  '4a857334afc92b91efeb3fa4824d91b4ff58c6cc': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=True, Show supporting text=True
  'e7e65e47830378f95a96e8e897dc3835c51909fe': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=True, Show supporting text=False
  'ada8b386b5bfda1fd1bf7db6b5577d9fb0090024': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=True, Show supporting text=False
  '80f49a091eb9866535eb147da4bf15c3a92e340e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=False
  '125f40fdbb8df8f164004ef461952b0d8ba6ce19': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=False
  'b7d95664826c71538b210d8001f0cee4ae371b24': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '0f7a1cc83b6e5be767acb77f781f226ce7e4f8ae': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Switch, Show overline=True, Show supporting text=False
  '75e1a9fbf267b5736ca98aad5c1c8abac6a2c114': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Icon, Show overline=True, Show supporting text=False
  '77341392afc393684287aae24082f434049fa592': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Check Box, Show overline=True, Show supporting text=False
  'af95ac448a99b5ac307c45df439aed738f0d5c4c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=None, Show overline=True, Show supporting text=False
  '76fe7dad3037c81ddd55b9ad1a77487d2518709d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '72bd4ce385d22ce36efd7d2c0494da8bdda7141d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=True, Show supporting text=True
  'a19eea45297a9ccf945b845fa69ca074fb813513': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=True, Show supporting text=True
  '3351c816ba6976f7ec0d15af61f6720dd5843064': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=True, Show supporting text=True
  '4ce731b166d27631f72a31c374460fc2a73d9f55': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=True, Show supporting text=True
  '2c727ce8a3e545f509d99e4eb56217c247f5c76e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '16d671ae303e1b3900dc1b2b12606099f432e887': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=True, Show supporting text=False
  '78914610e24cad1a8c9b027d8e4788b6a1cad23a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=True, Show supporting text=False
  'fdcbb8e6caf0b1bba9d7930cf131a62f0d0158fa': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=True, Show supporting text=False
  '2bd467e6422507d86b1bced16a47fccc6ea381be': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=True, Show supporting text=False
  '7970370060e76526fa7a21a53dcd8e47b264ec97': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'c7a2b3a79d1b196d0ad5741bbd6651f8fdc58ea8': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=False
  'bacdbfcf1a39661a2efaffbcbebf65cec802d1b0': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=False
  '13d14382173de6ae76d1100774c370d6b6d9490e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=False
  '8c084f7f47afb9632a3fb0969235d07e5e613c67': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=False, Show supporting text=False
  'cca5124009a3c33e8440273342dfe149030d55a7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '88996f028e581f6b0b5cbc014b33b5b5e0db9dae': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=True, Show supporting text=True
  '519cf8cf1721cfe78892e726e0814129525fd24f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=True, Show supporting text=True
  '22dae3c423bd497d9399bcd94dd9babd943a3e0c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=True, Show supporting text=True
  'a7e4bbecf50d221df1b14afbf39cc7665e7988e6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=True, Show supporting text=True
  'af7d4ecceb5df2c5177046ebae72a0a15b2b7f48': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '647b115d9c5d11ce00f38eef0591c7a326be0dba': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=True, Show supporting text=False
  '0f49b564103df218c607c72f7c13449825af12a6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=True, Show supporting text=False
  'fdbad2545f5d9f4b361bdab6c7189407af5cace4': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=True, Show supporting text=False
  '1ca7c9509386c46de16a329b956517544923b177': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=True, Show supporting text=False
  'f962cb6042f2f9d963744c85c2a6c5181c91fdaf': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '9515b8da097c94dcd283030b4dd03dfc92161b93': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=False, Show supporting text=False
  '80a883097cf168f39f4533094e1b3819e78b7094': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=False, Show supporting text=False
  '13148608fe8e3ceaffeccf4ccea69b995735cbc1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=False, Show supporting text=False
  'a1629e8dc2a67855166072e02712e8798feabfd5': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=False, Show supporting text=False
  'df891aed48ed0c7eba87bf012e2836eac307abb0': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Radio Button, Show overline=True, Show supporting text=False
  'f73d35391761e243ca3a41d7077866bd2b99e920': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Switch, Show overline=True, Show supporting text=False
  '26d413db38385a91b37b3e9fb203d69bf40a5c38': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Icon, Show overline=True, Show supporting text=False
  '59991a56d73eee95a254bbbef88323e432a59a52': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Check Box, Show overline=True, Show supporting text=False
  'ee6c67876c973f67d53c52ee0d6b69e3c4a2b357': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=None, Show overline=True, Show supporting text=False
  '2b3aa49c9b783945494d344bb54faa261c370890': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '5deb0bacfc67936bdc3ad02a47045b6f323be467': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=True, Show supporting text=True
  '82da0c2eee821cefb6a684e6e78a1edfcb42210a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=True, Show supporting text=True
  '41befdee20414ad84d031e7a02d9f1ca2924b442': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=True, Show supporting text=True
  '93e8ed6f815a9b1fc04a8c23ea09188239b6fe08': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=True, Show supporting text=True
  '7987ddf10a92d0342f3e8c4661a5f66152c08c0c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '70b40951c27a4c76ce8fa9d3686a9be9c711f5d0': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=True, Show supporting text=False
  '1b424b5bb5fb2d50355f1983a97c43554adb1794': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=True, Show supporting text=False
  '24fc05ce06b68ce6854e85a283b46779b7db0ae7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=True, Show supporting text=False
  '7a2dcac53edf4fedc2b5bfea63ae58d02e092eb9': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=True, Show supporting text=False
  '23cdbe3e197476af4e555036b54b69e70c86e59f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '596659d726c698e2bf7665a122624b679650c06f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=False
  '03bfa49ca75626bc0d9d5ae41b5232015306c277': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=False
  '847f8f568cb40607f1c06b2f99f39c4ffb1a6822': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=False
  '42afd3e6c17c66325f72eede377015ecffa1b894': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=False
  'd9b59b3fcbac51c03108f8851c7f7f7391ab5eb0': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Radio Button, Show overline=True, Show supporting text=False
  'b048a23c9b2748406e1eeb4cc25be355f9241857': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Switch, Show overline=True, Show supporting text=False
  'b3b2a97c6feda2c533a4cde94a53e3e06212a4de': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Icon, Show overline=True, Show supporting text=False
  'f21dc5e13c3a55e678266d5b331081cedcd8dbea': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Check Box, Show overline=True, Show supporting text=False
  'a758c46f7536ac021691ed8c690aeb3218ee2f8a': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=None, Show overline=True, Show supporting text=False
  'a7cd110c49560377034d062e427674ede3f89bba': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=True, Show supporting text=True
  'cf04fd07b2a47ee66beb5c790e626fb0c85d16ee': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=True, Show supporting text=True
  '1109a3126b33a70efd3f8afc80d74fba527c7d0d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=True, Show supporting text=True
  '49dfe179aaf5363cd77dc6730074972b6d7d915e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=True, Show supporting text=True
  'e2134ae84d26300047c4caf4ea5ccc5b9a84f8be': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=True, Show supporting text=True
  'd9df79ef7a1276fda2d6599d6c457f9357526fbf': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=True, Show supporting text=False
  'f8c62c7a8b9098cdbba2596aa29ee4f056b99caf': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=True, Show supporting text=False
  '3a8e438d1dea234210fe14acfc22d88594efcc93': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=True, Show supporting text=False
  '78e3d0caa30c58e7e6e0caa32f446ababfda1e6a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=True, Show supporting text=False
  'aa4e3c120679d26ff73e41452b843c55d6005d74': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=True, Show supporting text=False
  '349de3b6261e74ecabfec4545cb4167c1452747a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '020844a5bbecf2101c34375771f057a1bd599155': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=False
  'c0a4e8accd16f5607b47512962dc82ee5ff9ccb9': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=False
  'aad5a8c3f9df64b14ae58790a5c94182864eb2b7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=False
  '8358ed3630e930b0ea4409604c11fd6c0a9b85b3': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=False
  'bb54b045b5345c441d8524e5507950f51558a972': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '3cc972b258a3dc2c7d40b02e81c0453aec01bc3e': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Switch, Show overline=True, Show supporting text=False
  'febcfc9ee29801c7e04910f1b9426fa44c8cc83e': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Icon, Show overline=True, Show supporting text=False
  '7f147200ad673c68b75c601fcc2a63664c92807f': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Check Box, Show overline=True, Show supporting text=False
  'df554a4bb01fc7bc991826f74e182d4b3387c952': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=None, Show overline=True, Show supporting text=False
  'c3406ea187122628e643067b85a47d0ae127d58a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=True, Show supporting text=True
  '04e079876717a15d02e84f0220aa0065d80b002c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=True, Show supporting text=True
  '5765e9b322229f716b57b3b1fee8696547f86fd9': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=True, Show supporting text=True
  '1d61bcc95b016e9cc5558a8a70abb589c8cb636f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=True, Show supporting text=True
  'f05f8d7fac66524efc5d67c1475ad6524a2d06ee': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=True, Show supporting text=True
  'b4751c0182a101e80e90421e2b5a102f04f7edc5': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=True, Show supporting text=False
  '9bf5b181e62279f4dbacb061e79254715aa66f21': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=True, Show supporting text=False
  '75a2c93b2cbb5336a661f30eb002daa341d67a3b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=True, Show supporting text=False
  '8bf916f5d6594f05f6734ce1a70b33baaf2a5d93': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=True, Show supporting text=False
  '503350b8a5e53706bef60d12058b9214c9c3aba6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=True, Show supporting text=False
  '11d8e81af7ce89007811805236b73cdb544f0ba5': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'aebc15519755c19b4cc2eea14823307611b58e0c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=False
  'c7c98a8a285ca163d4f858f684fb3ccb12cc4cb4': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=False
  'cae04459801d2337fbb7474fbc49edd50125661c': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=False
  'bb720baccaba7e697f7c984e841105789a2fd55f': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=False, Show supporting text=False
  '15b771d52dc5b804f238bc6dcaa089d182800c06': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=False
  'be59ffc5d619d90711dbdb53321f757e1dff57b1': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=False
  '4f8e588b82d3641fd928479d32c71c9b71e7d7ec': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=True
  'af09b9a235d7b661533cb77270afd31e85474e00': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=True
  '99f56df0b6f8c5b5138dd2edfae1d55ab19500b1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=Icon, Show overline=False, Show supporting text=True
  '074a515a41270a9de3f914c1ca1a384a6c807dff': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Switch, Trailing=None, Show overline=False, Show supporting text=True
  '2fbde2ecd9399db72a71a645c37db0d9369ad5fc': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=False
  'a53489953719e139a963ed12e5f504a37851961f': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=False
  '5dbdaf41ca752ce6e81becb1b27c2963e7e75b4c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=True
  '07fe563e77e137406506bba69207c81aca81fe3c': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=True
  'd9b204c09a972d453b200a947d5951014bac6a00': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=Icon, Show overline=False, Show supporting text=True
  '57636554fcb8513f6944935aab3da9baeea4177b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Radio Button, Trailing=None, Show overline=False, Show supporting text=True
  '1de680ad6d2674e6d6643e089ca31b96391d94b8': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=False
  '7aa7b47d606ea2a335c6284f10d229a25e52e5aa': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=False
  '792501bf9c8d47b55edc832618ec1dc52ae28ab7': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=True
  'b5fb663aaa24187232f1f7d9c338f86956ab74f8': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=True
  '69bfe2d75ee236665c0590ee700d2908538894d4': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=Icon, Show overline=False, Show supporting text=True
  'c9c7610e47309570c5b8aaf2ecd3526ec643bab0': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Check Box, Trailing=None, Show overline=False, Show supporting text=True
  '08b00938ea31f6c6a7e49d0816dee5e6d95dfadc': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=False
  '64e9d4bf601a6d2e5f3e3399a54cd4be63bf877b': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=False
  '2f9d6fc850f67c6a6269c7fc854907a1c06c55b4': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=False
  'bd3b914a82ce55b4a316e234d38cca38bc7d32d2': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=False
  '3736a0eaf263def40a388712999ce1394f5dfb0c': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Video, Trailing=None, Show overline=False, Show supporting text=False
  '0f5ef40b8a9a2b781ae2a0075c619ae897f9d457': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'b376e494d0b301c1bce43b56192060212f241d2e': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=True
  '0c088a7c2603899eac18bb73923f68cf6d8b4546': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=True
  '72152bc2d13ae758cda67ab789a1e4e1f1033e19': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=True
  '1a53023515918b273b2d1fada7c9bcd2d87a29a0': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Video, Trailing=None, Show overline=False, Show supporting text=True
  '956f96b123b3356a9fdd6e14fa595ac0deb30b59': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '57329069760fd8d06db529eee491a62d83146254': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Switch, Show overline=False, Show supporting text=True
  '344af9094c1fd5b875ce5f44a875ed03cd4c5387': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Icon, Show overline=False, Show supporting text=True
  'c3c2cc2354e08b338d329072c09a1aa2075e1123': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=Check Box, Show overline=False, Show supporting text=True
  '804fc23b868f545294b30a865a42faad8de023e2': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Video, Trailing=None, Show overline=False, Show supporting text=True
  'de286c19c636ef1ac56ceadac593c38d607ccca1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'd0d8fc5cd782300afa46a2632b7b679fb96598ad': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Switch, Show overline=False, Show supporting text=True
  '825b4e736a803da256ef7e8a987bfdbd950a65f7': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Icon, Show overline=False, Show supporting text=True
  'a78bad61b4ab329f65aa6e41a072159dd04f9b45': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=Check Box, Show overline=False, Show supporting text=True
  'a27160fdea3536e8775c4c44730f4955748e4fed': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Image, Trailing=None, Show overline=False, Show supporting text=True
  '85975a0dd8cfb40fc1e3086a50f6bb392d3eda67': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'c83879d1aac5db615287d6f89ff37ec4525d8946': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=False
  '3df205949b4a85f55a4f07635ba14dfe3d01a60b': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=False
  '7d3033adf33c57d5cf9f8d96a28575bfb7fdbc62': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=False
  '8e394e663a2b4a613bd3eced7b6ab3dd041a96a6': 'Spandex - Atomic Components',  // Condition=1-line, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=False
  'b2c877285bf648d8f5f5935fc36bf90514a5cac8': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '0079b1dcbe145ceb16963938380972561c5f1a1a': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=True
  '0317ed1e2cda9fd928104c755dfaeddbbc6d2eaf': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=True
  'c82d514fd72666f1938c6cd6872beff5f882f238': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=True
  '13541f4ef01426936f5c9d99e466c76dd025c8e8': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=True
  '370897229717d5423dcfe19abea03f524efafe59': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '3dbe06a6c1a5470fe8ec35dd33ca65f72835960b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Switch, Show overline=False, Show supporting text=True
  'c1cd6affca88dd90ac809ad67dc573f358d77e78': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Icon, Show overline=False, Show supporting text=True
  '4b052b511ca1cfc7735a7c2461145b1ea1f597d6': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=Check Box, Show overline=False, Show supporting text=True
  '5f1fc26b1276c8e70c395f5ec33b03041d6bf630': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Icon, Trailing=None, Show overline=False, Show supporting text=True
  'd37aae86afdd112f007caa11496c447b30fada79': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'd405656c17fb4954bb73af6f68e2199f8b1d7669': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=True
  '1e6298e4c8886d271cef8c25c11e43d114f6b8af': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=True
  'ce87b0c2a3c3ffda6b05cce5102bb0ce65ea3ec0': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=True
  '4113ef49868da669b8e5b3c243af46ff2b2cce85': 'Spandex - Atomic Components',  // Condition=2-line, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=True
  'a516288c3be59a4346a83eb65a54ff4aff42d29a': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '4d35aed276f247b09a461dd914d9c90ff877e94e': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Switch, Show overline=False, Show supporting text=True
  '6d88153b316b1887ccbbb2c5e080e1e74f27d3b3': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Icon, Show overline=False, Show supporting text=True
  'fae4e58f94ec8f786c577a2257b1f721059af8ce': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=Check Box, Show overline=False, Show supporting text=True
  'f5b25cec438a6a0045223ce55c37dd0f4b85f06b': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=Monogram, Trailing=None, Show overline=False, Show supporting text=True
  '549377ff57eddf1346d54ec68fbe0e1b5ebca0b8': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=False
  'eb6712864b4e2223ad267ca9cdfbaa6e30cd5ffb': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=False
  '90507192ce06ee3fe14472b3c6d7af6e32f5eefc': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=False
  '41b6a31e8e14041bd57495ed498c3cc0f7408fb3': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=False
  'd5c92921156b30d0f1ded39e3f5a7719f273c54b': 'Spandex - Atomic Components',  // Condition=1-line, Leading=None, Trailing=None, Show overline=False, Show supporting text=False
  '23e1485171691ea29d62ad4fe513d345e9b17ff6': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=True
  '70dbbd8fd63ad667fc93959f09a68e8375ccc0fb': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=True
  '45e3866d429f93e10269c252a3234cdc75e7e9c3': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=True
  '52bed701de2230ded310436ec34a85c3aa5c2b51': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=True
  '6466edca4b1684f68bc033dc9c5f1488209bff89': 'Spandex - Atomic Components',  // Condition=2-line, Leading=None, Trailing=None, Show overline=False, Show supporting text=True
  '08b4cf86543c1b6d9f9b05045bdf46218654899d': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Radio Button, Show overline=False, Show supporting text=True
  'b403bd6d1abfb740de243d46ade64b46e4deeba1': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Switch, Show overline=False, Show supporting text=True
  '649a17960ad52c43e3a9277467d745aad5d4d4fd': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Icon, Show overline=False, Show supporting text=True
  'e6c126d897d78bf8c4e16b2aa2e4cb2eaace0f57': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=Check Box, Show overline=False, Show supporting text=True
  '346f4ac11b6918a15f1d69c3bc106bd5531c27ab': 'Spandex - Atomic Components',  // Condition=3-line+, Leading=None, Trailing=None, Show overline=False, Show supporting text=True
  '5fec851a19992739c4c1e19c145e52e80ace8bb9': 'Spandex - Atomic Components',  // rowType=Default
  '49e28b5404b796746d8c3e9ddb7d19c78bbb47f9': 'Spandex - Atomic Components',  // rowType=trailingIcon
  'e27233ded1ac5f46506eb8b77a441c0463fbc375': 'Spandex - Atomic Components',  // rowType=trailingControl
  '1363a2f5ea4758f4b7156bb4853441ae0e2448aa': 'Spandex - Atomic Components',  // rowType=trailingButton
  'b1b820b0e8f6fcf75e440a216d3db9793cb8fe05': 'Spandex - Atomic Components',  // rowType=leadingControl
  '04b23c8867cbe6fbcf34552d5b55a2fe55a20974': 'Spandex - Atomic Components',  // rowType=Default
  'c22beeeffde74c9be346459a7e1327e7da2ed877': 'Spandex - Atomic Components',  // rowType=trailingIcon
  '7a085b9aaf5a36589006a6908a3d759be7e2fa07': 'Spandex - Atomic Components',  // rowType=trailingControl
  'c9fab2bf3f8d33c071b6cffa325c3454c4ed55cc': 'Spandex - Atomic Components',  // rowType=trailingButton
  '4d77ca913b030af5eaf64cda47f32364530fdd4b': 'Spandex - Atomic Components',  // rowType=leadingControl
  'a636034b560fedc51f5174903180c43bba73609b': 'Spandex - Atomic Components',  // ↪ Symbol=chevron
  'a766885d97b231103fcc5e79676587648558364f': 'Spandex - Atomic Components',  // ↪ Symbol=icon
  '2ae4a6247a23d4bc3a09df298e1d1870fb27d1f9': 'Spandex - Atomic Components',  // ↪ Symbol=check
  '33735ce44be0d909537c6a078c51d53d97306719': 'Spandex - Atomic Components',  // ↪ Symbol=icon
  'a57c4fd2b837d4409137b87ab16b8970d2ba92f6': 'Spandex - Atomic Components',  // ↪ Symbol=favicon
  '2e2e4e563bb26e3214aef212ce2c8456df8e653a': 'Spandex - Atomic Components',  // ↪ Symbol=avatar
  'f0a93889e7f168b62d15bbd019f1ae0337ba3153': 'Spandex - Atomic Components',  // ↪ Symbol=map-light
  'afd28790c5542c3df0cc821844aa3e2c696049bd': 'Spandex - Atomic Components',  // ↪ Symbol=map-dark
  '64f318ef4144e9e485d5f7e085bebe19833f99b1': 'Spandex - Atomic Components',  // ↪ Symbol=map-satellite
  '27d77fa68706858190b8b58ea7af88ac5238cc44': 'Spandex - Atomic Components',  // ↪ Symbol=map-hybrid
  '4e6a1955c91a27861bfdf89d2313c0515fc3ae4b': 'Spandex - Atomic Components',  // ↪ Symbol=facepile
  'f29238f6d8b49bfaaf04369f8cb14629717506ad': 'Spandex - Atomic Components',  // ↪ Symbol=badge
  'e63d9b6ee3ae960908fbb9c32a1b7568fd3faf7b': 'Spandex - Atomic Components',  // ↪ Symbol=map-layer
  'a2e51b31c0678ca80711cf142c9b617bc2e097a2': 'Spandex - Atomic Components',  // ↪ Symbol=blank
  '9c903fede513f6cb83e043d80fc0f1488c4d22aa': 'Spandex - Atomic Components',  // controlType=Checkbox
  'c26821d19381388856bca0912c6cc272f3dfc0ca': 'Spandex - Atomic Components',  // controlType=Switch
  'f5146240d9ec01e571e6c96ba5c63b7411426bcb': 'Spandex - Atomic Components',  // controlType=Radio
  '45591e1df4dc4b2d32c673e82f3b02b79b2d4a88': 'Spandex - Atomic Components',  // controlType=Checkbox
  '37f195cdf1db25cb52acc688bd40c920a68f2c65': 'Spandex - Atomic Components',  // controlType=Switch
  '165edc782f03e83cb86a714ad9cb8d3ba16d428c': 'Spandex - Atomic Components',  // controlType=Radio
  'bbe3e2696a9e21340b5b395e035c3026a81d80c7': 'Spandex - Atomic Components',  // Icons=False, Selected=Left, twoOptions=True, threeOptions=False, fourOptions=False, fiveOptions=False
  '540dc1dbd917978f3556929d7aa71c2b835fd76a': 'Spandex - Atomic Components',  // Icons=False, Selected=Right, twoOptions=True, threeOptions=False, fourOptions=False, fiveOptions=False
  'd5d2047fb61c104c5ee38e2e5cc91758925dbc9f': 'Spandex - Atomic Components',  // Icons=False, Selected=Left, twoOptions=False, threeOptions=True, fourOptions=False, fiveOptions=False
  'ff929bf572ebc38ce4202a9a728e4414bdc16e2b': 'Spandex - Atomic Components',  // Icons=False, Selected=Center, twoOptions=False, threeOptions=True, fourOptions=False, fiveOptions=False
  '601b0cb4889670712b1098011d61bd83a63e21a2': 'Spandex - Atomic Components',  // Icons=False, Selected=Right, twoOptions=False, threeOptions=True, fourOptions=False, fiveOptions=False
  'd0e74677ea2e14b1ade01a25d2f15fe73992b10f': 'Spandex - Atomic Components',  // Icons=False, Selected=Left, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  'be88d383829dc54f529566578d28f58dad7f9433': 'Spandex - Atomic Components',  // Icons=False, Selected=Center-Left, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  '747224197206735799ef5b7fb178879de623955f': 'Spandex - Atomic Components',  // Icons=False, Selected=Center Right, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  'e3cc5c9d2c03176fa1c62dfeef9f782140389936': 'Spandex - Atomic Components',  // Icons=False, Selected=Right, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  'e0e78131c997d9e8cb3fa892c7e5719caf88c2c1': 'Spandex - Atomic Components',  // Icons=False, Selected=Left, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  'dbb80902b0c9025b5b264a9f9a5038c3994e2401': 'Spandex - Atomic Components',  // Icons=False, Selected=Center-Left, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '49abb85c6e5154aa178345892c6c2dfb73a44fcc': 'Spandex - Atomic Components',  // Icons=False, Selected=Center, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '2e67c2c0be319609c2e9ba8fb69778285531ec63': 'Spandex - Atomic Components',  // Icons=False, Selected=Center Right, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '9b0e2b4328d31932dd5082e83100509ca6ea0b01': 'Spandex - Atomic Components',  // Icons=False, Selected=Right, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '697110c2581c30d8d5ddf3717958c1378a532b20': 'Spandex - Atomic Components',  // Icons=True, Selected=Left, twoOptions=True, threeOptions=False, fourOptions=False, fiveOptions=False
  '5339cc15700652bffcc87e7d836c26f1abc7e73e': 'Spandex - Atomic Components',  // Icons=True, Selected=Right, twoOptions=True, threeOptions=False, fourOptions=False, fiveOptions=False
  'cb033a59690870429b0a13a711c573ac547e9ff7': 'Spandex - Atomic Components',  // Icons=True, Selected=Left, twoOptions=False, threeOptions=True, fourOptions=False, fiveOptions=False
  '992db58e43104be2cf20cc3d729cae98e6b858c9': 'Spandex - Atomic Components',  // Icons=True, Selected=Center, twoOptions=False, threeOptions=True, fourOptions=False, fiveOptions=False
  'b9e3899b0178354ff8424964b41e701908e44a54': 'Spandex - Atomic Components',  // Icons=True, Selected=Right, twoOptions=False, threeOptions=True, fourOptions=False, fiveOptions=False
  'd1e6d27098a19658d48e573f610b150688c98703': 'Spandex - Atomic Components',  // Icons=True, Selected=Left, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  'bc57bf0bc4f38977665a8aca0a3dcb113e5badfa': 'Spandex - Atomic Components',  // Icons=True, Selected=Center-Left, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  '180d9c6014978d504986b315f9535fd7557a3bee': 'Spandex - Atomic Components',  // Icons=True, Selected=Center Right, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  'b38c59dce5d96da18c71fbe875cd1fd16268e77b': 'Spandex - Atomic Components',  // Icons=True, Selected=Right, twoOptions=False, threeOptions=False, fourOptions=True, fiveOptions=False
  'd81141acb4a3d548d31357cf63111984399651c5': 'Spandex - Atomic Components',  // Icons=True, Selected=Left, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '7576d1fa29db68b8b37dcb8bc9f5d9d9d35857df': 'Spandex - Atomic Components',  // Icons=True, Selected=Center-Left, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '0dc7ada99d9917397ac09abc492e609e06c722ed': 'Spandex - Atomic Components',  // Icons=True, Selected=Center, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  '2d7e5617a4539ca28b4543446801686c737d8b8b': 'Spandex - Atomic Components',  // Icons=True, Selected=Center Right, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  'f658657d55b0ed54452cb9d5fd1f6d465899cac4': 'Spandex - Atomic Components',  // Icons=True, Selected=Right, twoOptions=False, threeOptions=False, fourOptions=False, fiveOptions=True
  'b8cc431c5c76ad9f2136c91efa40e337c88fdf39': 'Spandex - Atomic Components',  // Segments=5, usesIcon=false
  '13c81b414e03c5c634bf587472574135592dcad5': 'Spandex - Atomic Components',  // Segments=5, usesIcon=true
  '0b5436f7e58ab574e40917db5dd50c011950ac1c': 'Spandex - Atomic Components',  // Segments=4, usesIcon=false
  'c475a85f51d74436d7e2dc8d8f86560dde3d5609': 'Spandex - Atomic Components',  // Segments=4, usesIcon=true
  '5512bcdac551ef465219371fa4ff75d527619a00': 'Spandex - Atomic Components',  // Segments=3, usesIcon=false
  'a7330e3222ba1d94d394c25157b967b9a47398a9': 'Spandex - Atomic Components',  // Segments=3, usesIcon=true
  '09c60d50491a4feb2df11dcdb7e4eeadd75227bc': 'Spandex - Atomic Components',  // Segments=2, usesIcon=false
  '2de667060584aad891c14a73751c11ace27559f4': 'Spandex - Atomic Components',  // Segments=2, usesIcon=true
  '96ad62c80f3272eb8386a6c2c3a186d5b70dc28d': 'Spandex - Atomic Components',  // isSelected=true, hasIcon=false
  '7ef8d18a2ebf8a116a024b7dc7737f6fc27ed769': 'Spandex - Atomic Components',  // isSelected=true, hasIcon=true
  '66c96259fad7fe97c8f5135a8bea021f7c8f223f': 'Spandex - Atomic Components',  // isSelected=false, hasIcon=false
  '783d4f4aff6e2d13286bc34fd20b0c61517eed08': 'Spandex - Atomic Components',  // isSelected=false, hasIcon=true
  'f6a753651a1314d82c0cd8c75f58799514127594': 'Spandex - Atomic Components',  // State=disabled, Configuration=icon only, Selected=false
  'e6607d870c4c49e2a5e0ae6d0251764b5ec24f46': 'Spandex - Atomic Components',  // State=disabled, Configuration=label only, Selected=false
  'ccab2fb4be7e8ce98784d93d5f890a16b5650562': 'Spandex - Atomic Components',  // State=disabled, Configuration=label & icon, Selected=false
  'cc7f56709457290f83b436dc97211f1495a78ba8': 'Spandex - Atomic Components',  // State=pressed, Configuration=icon only, Selected=false
  'c17c6f4329315c42cea3cf157216e3d4ec659f47': 'Spandex - Atomic Components',  // State=pressed, Configuration=label only, Selected=false
  '2c71027dda2a7858f10735b6aeb52bebc7f33fbf': 'Spandex - Atomic Components',  // State=pressed, Configuration=label & icon, Selected=false
  '1f03af686250158c202da536c8e4981b50d05fa1': 'Spandex - Atomic Components',  // State=pressed, Configuration=icon only, Selected=true
  '66e71e38af449b0177fcfd28ac53dc9fd5fd8fdb': 'Spandex - Atomic Components',  // State=pressed, Configuration=label & icon, Selected=true
  'd76be72a7781ba6b0493719404f4e1b022ab477c': 'Spandex - Atomic Components',  // State=pressed, Configuration=label only, Selected=true
  '586e31e956f928cec2bfdb7dfc948c9558ec6d4d': 'Spandex - Atomic Components',  // State=enabled, Configuration=icon only, Selected=false
  'e2bd26a17ab4cf4567205219de9453239fc902cb': 'Spandex - Atomic Components',  // State=enabled, Configuration=label only, Selected=false
  '1239abb151ab14e4bcacb63e3ce78f118712b396': 'Spandex - Atomic Components',  // State=enabled, Configuration=label & icon, Selected=false
  '35dc2ce008bceaeda0d69c60ece8e2c43222fbec': 'Spandex - Atomic Components',  // State=enabled, Configuration=icon only, Selected=true
  '4693d94f12c08369fa592d97b044f759ec316dd0': 'Spandex - Atomic Components',  // State=enabled, Configuration=label & icon, Selected=true
  'd233712bda36a11c0136ddd971feedd52dac5a47': 'Spandex - Atomic Components',  // State=enabled, Configuration=label only, Selected=true
  'afacb2646c751757308701390bf45001688dda84': 'Spandex - Atomic Components',  // State=disabled, Configuration=icon only, Selected=false
  'abba837bc93f96bb39b31d43202bd9f96a734a49': 'Spandex - Atomic Components',  // State=disabled, Configuration=label only, Selected=false
  '08e17e6866860a7d41dfd999b66d40afcebf3716': 'Spandex - Atomic Components',  // State=disabled, Configuration=label & icon, Selected=false
  'be3a61e2c53cc0a8816afa74a246e65615f22669': 'Spandex - Atomic Components',  // State=pressed, Configuration=icon only, Selected=false
  '75c79caad558167e2ebdd1a907660e549f9bb896': 'Spandex - Atomic Components',  // State=pressed, Configuration=label & icon, Selected=false
  'c5e3adba53eb1109d65f68dd0cd70f7da1bdfde9': 'Spandex - Atomic Components',  // State=pressed, Configuration=label only, Selected=false
  'b761344b0540c22c688e23568f80e4dd880153b0': 'Spandex - Atomic Components',  // State=pressed, Configuration=icon only, Selected=true
  '2dab837771ff84a16c84e781bc3d427f475d3e37': 'Spandex - Atomic Components',  // State=pressed, Configuration=label only, Selected=true
  '281c37e29730dd29f4d80f43421f809011ebac7c': 'Spandex - Atomic Components',  // State=pressed, Configuration=label & icon, Selected=true
  '43627ec51af94ccc3217349de5ecc1a5a18029fd': 'Spandex - Atomic Components',  // State=enabled, Configuration=icon only, Selected=false
  '572f60ea643e4731b7df35abf40cc2c075f5a359': 'Spandex - Atomic Components',  // State=enabled, Configuration=label & icon, Selected=false
  '96934cff24fd7064b24c2ecc5c5689b15a41ca26': 'Spandex - Atomic Components',  // State=enabled, Configuration=label only, Selected=false
  '994c4dbc14a8f337172243dae73d3737ce98472b': 'Spandex - Atomic Components',  // State=enabled, Configuration=icon only, Selected=true
  'ad82ed5bb917ce5cb786f6036e3827b4c9b88e74': 'Spandex - Atomic Components',  // State=enabled, Configuration=label only, Selected=true
  'b529296e67e31e427ab6b71e2ac954b3e74a243a': 'Spandex - Atomic Components',  // State=enabled, Configuration=label & icon, Selected=true
  '981fe780383bdfdcf4098c284801c5db0bd8b76c': 'Spandex - Atomic Components',  // State=disabled, Configuration=icon only, Selected=false
  '08442fa0f312d3b9d322341f65b0310e0ea68ed9': 'Spandex - Atomic Components',  // State=disabled, Configuration=label only, Selected=false
  'e108550e9a1539b6fd13a80e8b4f45461cd0215a': 'Spandex - Atomic Components',  // State=disabled, Configuration=label & icon, Selected=false
  'd7e92cc16b89b87161f08fdb910023f90cb746bd': 'Spandex - Atomic Components',  // State=pressed, Configuration=icon only, Selected=false
  'eef50783b7eae728c2ccf99a1342d5da5b8100c8': 'Spandex - Atomic Components',  // State=pressed, Configuration=label only, Selected=false
  '8cd49f34465ca56b313b994ee7fb1f8a481a78dd': 'Spandex - Atomic Components',  // State=pressed, Configuration=label & icon, Selected=false
  '01dbb69234a07b7b94a4f7efcf8c6777f30c31ff': 'Spandex - Atomic Components',  // State=pressed, Configuration=icon only, Selected=true
  '8a8f3b012b1ed988351af60a6234c88e40282a2e': 'Spandex - Atomic Components',  // State=pressed, Configuration=label & icon, Selected=true
  'de6847b08b735742311939d83a644e409854261c': 'Spandex - Atomic Components',  // State=pressed, Configuration=label only, Selected=true
  '69fe09e8c3a3eed1eb886f64a0c051321c95eb5f': 'Spandex - Atomic Components',  // State=enabled, Configuration=icon only, Selected=false
  '380cc1591472b8dad37204b222a60de09cb69954': 'Spandex - Atomic Components',  // State=enabled, Configuration=label only, Selected=false
  '82bcc86e8cc38b8dba7fa11c11b45765638b7ed1': 'Spandex - Atomic Components',  // State=enabled, Configuration=label & icon, Selected=false
  '158dceee590144c8f8a5f7dcd41c28bfb1708f42': 'Spandex - Atomic Components',  // State=enabled, Configuration=icon only, Selected=true
  '9751848137763f403c6f0976f1a3760c063f2d00': 'Spandex - Atomic Components',  // State=enabled, Configuration=label & icon, Selected=true
  'e3cfc04b013aad200eca5f76e3f03632627a7198': 'Spandex - Atomic Components',  // State=enabled, Configuration=label only, Selected=true
  '459f9d0721b19288ec38edda103c48d0727bb843': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=false, isError=false
  'bdec7e854563191de3ca8629f4e446919b41402d': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=true, isError=false
  '1c65692c86e46e79b3848d3a6afc124dd053e71a': 'Spandex - Atomic Components',  // isActive=false, isFilled=true, isDisabled=false, isError=false
  'ac072e213f4e5e79e61334b63774cffdc2e76da3': 'Spandex - Atomic Components',  // isActive=true, isFilled=false, isDisabled=false, isError=false
  'c670e5409e7713b29356e402793b4d5dd94ecd63': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=false, isError=true
  '0c9e2f2bf2f146e1945d272cc53da367becb6fde': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=false, isError=false
  '28ab1fb609e11009277dca32ca2e2d888c3313f8': 'Spandex - Atomic Components',  // isActive=true, isFilled=false, isDisabled=false, isError=false
  '6311b3bf34fdc6b819bba43db4acd08cb2f51a98': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=true, isError=false
  '653db33b44ad69aaa800ab0629b1a26d66dd045c': 'Spandex - Atomic Components',  // isActive=false, isFilled=true, isDisabled=false, isError=false
  '9f08c2bf81ea1b192eba85bfd213fc7f5ffe4d63': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=false, isError=true
  '882925c982dcb14fc4e622e6d4471c4fa8826863': 'Spandex - Atomic Components',  // isActive=false, isFilled=true, isError=false, isDisabled=false
  'b2fd66b8b9e45c53e5ca8e984070e2f86a906139': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isError=false, isDisabled=false
  'b6ded2583c7220ce8ef86303c750d6fd6be78f58': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isError=false, isDisabled=true
  '020499ef77dbe8ce46bbdf593035475891651bc8': 'Spandex - Atomic Components',  // isActive=true, isFilled=false, isError=false, isDisabled=false
  '797b3e27dfbc7d8b05333c83721f363cbd9720ee': 'Spandex - Atomic Components',  // isActive=true, isFilled=true, isError=false, isDisabled=false
  '4f3428194b8228792ed0c753648acc4e1cdca34c': 'Spandex - Atomic Components',  // isActive=true, isFilled=false, isDisabled=false, isError=true
  'c579854c91c3308b31b624ab1517b25225e5240e': 'Spandex - Atomic Components',  // isFilled=true, isActive=false, isError=false, isDisabled=false
  'a6e3e5c37fb4cc2df5b09df68e627780512b70a0': 'Spandex - Atomic Components',  // isFilled=false, isActive=false, isError=false, isDisabled=false
  'a6e69c03461bae8f612a0d9e8effad938ccc091c': 'Spandex - Atomic Components',  // isFilled=false, isActive=false, isError=false, isDisabled=true
  'e418ab4a230be5cf03b03ec69a1abed317ac06b3': 'Spandex - Atomic Components',  // isFilled=false, isActive=false, isError=true, isDisabled=false
  '7b076dd3a280f34989060615b5e16927c369aacd': 'Spandex - Atomic Components',  // isFilled=false, isActive=true, isError=false, isDisabled=false
  '0f39f4ee405a9d242533e1470403840059dfa43f': 'Spandex - Atomic Components',  // isFilled=true, isActive=true, isError=false, isDisabled=false
  'ab74af8d8bfa08ddd653b70be9c552966af6375f': 'Spandex - Atomic Components',  // _segmentedInput-cursor-iOS
  'f06215d276acb5bea33d1e23b3bcc9f9229f2627': 'Spandex - Atomic Components',  // _segmentedInput-cursor-Android
  '43e5145cb9cf64dbc938556b6d242dc628e9e544': 'Spandex - Atomic Components',  // hasRange=false, isDefaultValue=true
  'b5cf9bea83e3c7a92c7b912e1ef558ca73e2f848': 'Spandex - Atomic Components',  // hasRange=true, isDefaultValue=true
  '81b6e7d9cb9579afd02f086dcdbee2985813d947': 'Spandex - Atomic Components',  // hasRange=false, isDefaultValue=false
  '41d786cf4b9bc1b85d3fe2a0540ec86e26d5d2d0': 'Spandex - Atomic Components',  // hasRange=true, isDefaultValue=false
  '968c5eb029b1cf44229119d7114f76ba13fdfbc8': 'Spandex - Atomic Components',  // Platform=Android Slider
  '9507c0531173364f08321ba69378eb5aee8cccad': 'Spandex - Atomic Components',  // Platform=iOS Slider
  'd1ef3f93eccaedaa0bfb8462aec4dc5b041c420a': 'Spandex - Atomic Components',  // isRed=true, isOrange=false, isGray=False
  'eaa6ef269ddb0694ae8fa9cbfc72d7abf63ef80c': 'Spandex - Atomic Components',  // isRed=false, isOrange=true, isGray=False
  '41f2f94b252372c75ca5510b6e98afe3e1a7d510': 'Spandex - Atomic Components',  // isRed=false, isOrange=false, isGray=true
  'a9b07140042fc996a1d1503c2a8a065e581e21a2': 'Spandex - Atomic Components',  // isWhite=true, isGreen=false, isCheckered=false, isDarkGray=false
  'c981b226381a7ff2c66cb67ed62a4f3e6a258268': 'Spandex - Atomic Components',  // isWhite=false, isGreen=true, isCheckered=false, isDarkGray=false
  'ee1ed9581bd1261192888af9734966017c192c20': 'Spandex - Atomic Components',  // isWhite=false, isGreen=false, isCheckered=true, isDarkGray=false
  '7f11a44e9e118d8eaeee92eb933864401e914991': 'Spandex - Atomic Components',  // isWhite=false, isGreen=false, isCheckered=false, isDarkGray=true
  'e34dd5dc1559f6c32d246d0a44a262409581f787': 'Spandex - Atomic Components',  // checkerPattern
  '40c373a426bcb2d6acdd4a1d96e0e78465f8633d': 'Spandex - Atomic Components',  // ↪︎ isPrimary=true, ↪︎ isSecondary=false, ↪︎ isTertiary=false
  '3a0d9f8e8a74188e641d9037d9d5fa9f4d3f1172': 'Spandex - Atomic Components',  // ↪︎ isPrimary=false, ↪︎ isSecondary=true, ↪︎ isTertiary=false
  '0bed94947914249f569bf7c77f79578367bd1dbf': 'Spandex - Atomic Components',  // ↪︎ isPrimary=false, ↪︎ isSecondary=false, ↪︎ isTertiary=true
  'f832f24266ead9fbbd4d85cf6f9306cd4174c7c7': 'Spandex - Atomic Components',  // Count=2
  'f38d7076b0d31309fe2843f925bbfb94b0c04719': 'Spandex - Atomic Components',  // Count=3
  'cf3c0ad98805d2e47595f6b30cbde45e4eb9dad7': 'Spandex - Atomic Components',  // Count=4
  'c351982460a1a030c2603e4d48ce8e2c58cdc55c': 'Spandex - Atomic Components',  // Count=5
  '93a3c3048c42dff28ff3451ee4975027331bbbac': 'Spandex - Atomic Components',  // Count=6
  'c753f3eb10bfde44e6d8066e2d361b85038411d5': 'Spandex - Atomic Components',  // hasOrangeTrack=True, hasGrayTrack=False
  '96a75910e53194d7d3ca0d4a57c2797cc5385725': 'Spandex - Atomic Components',  // hasOrangeTrack=False, hasGrayTrack=True
  '400bced936737b1e509f6b8e6a77a64284282199': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=false
  '615ed54e9b62302cb89f1a7bcb2830f6cda0a7bd': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=false
  '5deadcb516d9b57cd5ae0da893c63205120cd957': 'Spandex - Atomic Components',  // isSelected=true, isDisabled=true
  'eab53cd5e6f7be25d4948556caae5a99ecf869e1': 'Spandex - Atomic Components',  // isSelected=false, isDisabled=true
  'd05d2b72852c632a612efeca155c3e2613f651dc': 'Spandex - Atomic Components',  // isSelected=True, isDisabled=False
  '393af75bbef8b259b539f80fee6997dc7ee099e5': 'Spandex - Atomic Components',  // isSelected=False, isDisabled=False
  'c37ffdcf7fa7e08eb17af5ff39603ff81ecf9515': 'Spandex - Atomic Components',  // isSelected=True, isDisabled=True
  'dfcb51d07bd2ad07ba217372bcb8c77c6d041e9d': 'Spandex - Atomic Components',  // isSelected=False, isDisabled=True
  'eede79a3c5490e0e9eeb490b2e4c54fab41b6542': 'Spandex - Atomic Components',  // isAligned=leading
  '8a91731d32ff0c2a8e74f1350951d61ff101a312': 'Spandex - Atomic Components',  // isAligned=center
  '8af3d3cfd66a2c13392dca0646e9e4c0f763f86c': 'Spandex - Atomic Components',  // isAligned=trailing
  'a0bc0a70860961cf31837ba2a654b9aa06b93015': 'Spandex - Atomic Components',  // Count=2, Type=Text Only
  '36ddedda847c23f44ac8531ea4e9016f94edf079': 'Spandex - Atomic Components',  // Count=3, Type=Text Only
  '76ffa98da5eebb5133b5ab09beca0c17b45e3ee8': 'Spandex - Atomic Components',  // Count=4, Type=Text Only
  '48fbd12e0f8fd9f5b8d4cd2f0e1634902fd2d85a': 'Spandex - Atomic Components',  // Count=2, Type=Icon Only
  '51666d7a0cd3b4bd14e831b804d84359a5a38a8f': 'Spandex - Atomic Components',  // Count=3, Type=Icon Only
  'efe129f38d47e54a66b8652a4a6c38aaf924286a': 'Spandex - Atomic Components',  // Count=4, Type=Icon Only
  '36fea1c93fdd04d9f954ea4b1042159b0da29f51': 'Spandex - Atomic Components',  // Count=2, Type=Icon + Text
  '943cf41fd28a6947d27dc5b10924e789ba2a6673': 'Spandex - Atomic Components',  // Count=3, Type=Icon + Text
  'd67618b689f99fe9af2d6c118ded741ad23ac8dd': 'Spandex - Atomic Components',  // Count=4, Type=Icon + Text
  '9fa50c4390bf484a06e7f7972d5467ca0860df55': 'Spandex - Atomic Components',  // Count=2, Type=Text only
  'c4e909ece40ffc1057a1cd36e1f02325d963b3af': 'Spandex - Atomic Components',  // Count=3, Type=Text only
  '6cf4c908dcfe7149d490a1612dbe93be0790db90': 'Spandex - Atomic Components',  // Count=4, Type=Text only
  'e9222c54167818b46c9c65584a59e2773546e598': 'Spandex - Atomic Components',  // Count=2, Type=Text only (Secondary)
  '0187cdbd53bacaf68bf328b3921cfbc3f8b9528c': 'Spandex - Atomic Components',  // Count=3, Type=Text only (Secondary)
  '29c9b26380e309753fa18a31a8a8f603f02121be': 'Spandex - Atomic Components',  // Count=4, Type=Text only (Secondary)
  '0399d66624c9869e53b3ec746a9ac2f7eee9c33f': 'Spandex - Atomic Components',  // Count=2, Type=Icon only
  '866a5e2644fb3ce325f9417851124378e344c710': 'Spandex - Atomic Components',  // Count=3, Type=Icon only
  '5cf79a36aad981b687c790b02f6c6598fdded9e6': 'Spandex - Atomic Components',  // Count=4, Type=Icon only
  'df2727efd4106b856ea763f7d20b5338cecfa8a7': 'Spandex - Atomic Components',  // Count=2, Type=Text and Icon
  'cbbd15009ceae682c23ae738e354c71046683c72': 'Spandex - Atomic Components',  // Count=3, Type=Text and Icon
  '35a33ae25fed4e7826c940be86cfc57722f85ad4': 'Spandex - Atomic Components',  // Count=4, Type=Text and Icon
  '688cfad937818a04986e75454cf63ff918c2853d': 'Spandex - Atomic Components',  // isSelected=false, isIcon=false, isPressed=false, isIconAndText=false
  '36030f6ee53a3abd48030369273ddf509e0cb64d': 'Spandex - Atomic Components',  // isSelected=false, isIcon=false, isPressed=true, isIconAndText=false
  '2059172d3d45533fb1f6fab2719a063483750dea': 'Spandex - Atomic Components',  // isSelected=false, isIcon=true, isPressed=false, isIconAndText=false
  '8b5ddecd9cbd63b07a67eee65b3a85583b17d065': 'Spandex - Atomic Components',  // isSelected=false, isIcon=false, isPressed=false, isIconAndText=true
  '52f0d3172bad87bc7aba42b8db2c976c86870e7a': 'Spandex - Atomic Components',  // isSelected=false, isIcon=true, isPressed=true, isIconAndText=false
  'b2b5e1874eab9a3fdfd6e49a1b9702d41fcf337a': 'Spandex - Atomic Components',  // isSelected=false, isIcon=false, isPressed=true, isIconAndText=true
  '56a4d1361ff1cf2e4556f07a2009f28064faabb7': 'Spandex - Atomic Components',  // isSelected=true, isIcon=false, isPressed=false, isIconAndText=false
  '38e4b1db598f073290fd6d5ceb6ce25ad8ed2e0e': 'Spandex - Atomic Components',  // isSelected=true, isIcon=true, isPressed=false, isIconAndText=false
  '09b000b6b4933e9b9925a1abc37ac50a39a0adb4': 'Spandex - Atomic Components',  // isSelected=true, isIcon=false, isPressed=false, isIconAndText=true
  '79a435598710027936d8940c7c25e3694b72cfdf': 'Spandex - Atomic Components',  // State=enabled, Selected=false
  '5abc9c54643f0d8848e7588751abfa67697efe06': 'Spandex - Atomic Components',  // State=enabled, Selected=true
  'a4b9379f8a682f0d5a05c092423c906d216365b1': 'Spandex - Atomic Components',  // State=pressed, Selected=true
  '5301de4ce0f4ff290b76a2f6023d5cbfe42015fe': 'Spandex - Atomic Components',  // State=enabled, Selected=false
  '37b41679725df5217426f02881829809696523a0': 'Spandex - Atomic Components',  // State=enabled, Selected=true
  'f5bfd7ab6f9b1ae1df71777e331d760dee420670': 'Spandex - Atomic Components',  // State=pressed, Selected=true
  'a2781f03c4c4f79e37d24a03c9d8fcd7a4caca16': 'Spandex - Atomic Components',  // State=enabled, Selected=false
  'fe781b160d1262e1aca4e75db7a68a3810e129ce': 'Spandex - Atomic Components',  // State=enabled, Selected=true
  '98860a35ae3c8605fc30be1e5f368d1a28d333f8': 'Spandex - Atomic Components',  // State=pressed, Selected=true
  'cc70a8602a8569ad019325ba1ff8dcd77418840b': 'Spandex - Atomic Components',  // State=enabled, Selected=false
  '3bbca800f0695423de5abec20f2700a1227b3d6f': 'Spandex - Atomic Components',  // State=enabled, Selected=true
  '087102d900a48aa6323c6df0920d329b8e92159f': 'Spandex - Atomic Components',  // State=pressed, Selected=true
  '6615450a11e47b716c7f39eda6b2c8820dd9b292': 'Spandex - Atomic Components',  // isFloating=false, isOutlined=false, hasLeftPointer=false, hasRightPointer=false
  '53b8c68eae2b9d921c65c388fbde4af1bcc68fec': 'Spandex - Atomic Components',  // isFloating=false, isOutlined=true, hasLeftPointer=false, hasRightPointer=false
  'ef19fd0b3ce7d6809df049d679bbe1caf40ee151': 'Spandex - Atomic Components',  // isFloating=true, isOutlined=false, hasLeftPointer=false, hasRightPointer=false
  '7e31f04c441bbc8a0f4b294c0f0ff0c15c475c0a': 'Spandex - Atomic Components',  // isFloating=false, isOutlined=false, hasLeftPointer=true, hasRightPointer=false
  '0d3200304d19a6fc05cdccadce539d679f3689ec': 'Spandex - Atomic Components',  // isFloating=false, isOutlined=false, hasLeftPointer=false, hasRightPointer=true
  'c273ac6c5b59eed6755102806eadd12e5eadbf34': 'Spandex - Atomic Components',  // _Tag-Base-Pointer
  'e0d73b60144fcabe540703cfae1711bd2e60f8b0': 'Spandex - Atomic Components',  // Type=Icon
  '8b4c5e1187cbe4174a397ad0dda8fb9ff9341d70': 'Spandex - Atomic Components',  // Type=Rectangular Image
  '0d10dd1c1df63cc0e9686401fa9d77ece7930d85': 'Spandex - Atomic Components',  // Type=Square Image
  'eb969c0146258cd291519abbbc14a51ded5a0ffc': 'Spandex - Atomic Components',  // Type=Neutral Dark, onMedia=True
  '97a71bc5746d1e895d2e5133776583ee407e3694': 'Spandex - Atomic Components',  // Type=Info, onMedia=True
  'aab7c6bf46c57380e1bf2e3f32ad9bc3d7d7eb69': 'Spandex - Atomic Components',  // Type=Brand, onMedia=True
  '48a2a9ad13dbc5b97977516e7faf3d0e1c08ed89': 'Spandex - Atomic Components',  // Type=Negative, onMedia=True
  '269f367ad72e6e91a8663a98b8f83c09dde87975': 'Spandex - Atomic Components',  // Type=Positive, onMedia=True
  '1c798203183055df9123e3395d32b4eb22962244': 'Spandex - Atomic Components',  // Type=Neutral Light, onMedia=True
  '2c2e5563016f986cc5967002b3c8cb43b99e166b': 'Spandex - Atomic Components',  // Type=Default, onMedia=True
  'c5da51cd9011ac28da15d1e10697856f5862f78e': 'Spandex - Atomic Components',  // Type=Neutral Dark, onMedia=False
  'dc3b34f82c518ef9df06de1b1f23d6788182041e': 'Spandex - Atomic Components',  // Type=Info, onMedia=False
  '43b30410344351362a3ece4947f49f04d6dcd53c': 'Spandex - Atomic Components',  // Type=Brand, onMedia=False
  'e942397cec1ee94e6afc273e5501ddbc0a658c9a': 'Spandex - Atomic Components',  // Type=Negative, onMedia=False
  '045c2d9048c18acff2fbd483ec11fdff638ced79': 'Spandex - Atomic Components',  // Type=Positive, onMedia=False
  'cf2391490826f84595dd7719066e790ee9626850': 'Spandex - Atomic Components',  // Type=Neutral Light, onMedia=False
  '7dd2fb49f3fc512a0648e8585ac6da9a0a67d51d': 'Spandex - Atomic Components',  // Type=Default, onMedia=False
  'b6e586b92909c26625f6cb6e59d59a0ca6831bfe': 'Spandex - Atomic Components',  // Type=Icon
  'e54e2f1ab1abffa08f382bc0d27fcca854a62e0c': 'Spandex - Atomic Components',  // Type=Image
  'c1514ca9ed9bdc64734eb5fcd6cbc811f7d4d8ff': 'Spandex - Atomic Components',  // State=Disabled, onMedia=True
  '47ceaba5e5955ca177759cc06be2d5434f274b5e': 'Spandex - Atomic Components',  // State=Selected, onMedia=True
  '10f348a07b5f58410431e4945edbc005956385bb': 'Spandex - Atomic Components',  // State=Pressed, onMedia=True
  'c10a9283ede2ab4c45bb21e253832d6aaa81438b': 'Spandex - Atomic Components',  // State=Default, onMedia=True
  'adeb64cb9f77fdf6e6d95d8a28423c2cbc4f8485': 'Spandex - Atomic Components',  // State=Disabled, onMedia=False
  '4befa9feb5ee8ae29040e1542affce61e8bd06af': 'Spandex - Atomic Components',  // State=Selected, onMedia=False
  'ee6f5f731a83d698c172e08e69ab745977474d0c': 'Spandex - Atomic Components',  // State=Pressed, onMedia=False
  'ed1a88cb6b43fb324e06836c472607ad5ce62765': 'Spandex - Atomic Components',  // State=Default, onMedia=False
  '292ef17ad58a870108568f4cde04514cf4aac371': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=false, hasError=false
  '3181254173f96401c6ba5a461d8251619d95e626': 'Spandex - Atomic Components',  // isActive=true, isFilled=false, isDisabled=false, hasError=false
  '4c727371e11e67f0fea82ac9f51c6bc94a57093f': 'Spandex - Atomic Components',  // isActive=false, isFilled=true, isDisabled=false, hasError=false
  '15e56575cc7a95c021f768464da33ba2760c546d': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=false, hasError=true
  'f7100f799e84bce2aa90fc320163d34d46b6f2cb': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=true, hasError=false
  '0b0b33eb1347501f7081d03f82d959dedb89e439': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=False, hasError=false
  '54b505186f529a74946cd328496ca0eaf9ce1462': 'Spandex - Atomic Components',  // isActive=true, isFilled=false, isDisabled=False, hasError=false
  'f66648b6ab66254a3d51e80e1482a0319d7ded73': 'Spandex - Atomic Components',  // isActive=false, isFilled=true, isDisabled=False, hasError=false
  'f8a24a88d9a44245f91858843f275d99499e3c81': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=False, hasError=true
  'cd936e78cabef4510f542e7bebb4cfe0d0071209': 'Spandex - Atomic Components',  // isActive=false, isFilled=false, isDisabled=True, hasError=false
  'e87079cebcfac04a2d4776fd825b9bdbca5b5685': 'Spandex - Atomic Components',  // isActive=False, isFilled=False, isDisabled=False, hasError=False
  'cab8bf9e3921250f383dcf804082ca054173b234': 'Spandex - Atomic Components',  // isActive=True, isFilled=False, isDisabled=False, hasError=False
  '4fd3f6b56dc3c5ba9889a9758e0a860831d6f380': 'Spandex - Atomic Components',  // isActive=False, isFilled=False, isDisabled=False, hasError=True
  '30b84446ffa8d1b20aa0385778f557e35021e33b': 'Spandex - Atomic Components',  // isActive=False, isFilled=True, isDisabled=False, hasError=False
  '567cdd3145c7f2b8d59f473e3312f10dae68cab3': 'Spandex - Atomic Components',  // isActive=False, isFilled=False, isDisabled=True, hasError=False
  'd39732938cd5ac874418b4dcf8e19855d1e13afa': 'Spandex - Atomic Components',  // isActive=False, isFilled=False, isDisabled=False, hasTrailingIcon=False, hasError=False
  '39fa8ce7b0e7cf93076cb9626c2fc035a9b2e1a6': 'Spandex - Atomic Components',  // isActive=True, isFilled=False, isDisabled=False, hasTrailingIcon=False, hasError=False
  '6cfe1466ce8c8cfb82f7175e7b6deda4c7ae05ce': 'Spandex - Atomic Components',  // isActive=False, isFilled=False, isDisabled=False, hasTrailingIcon=True, hasError=True
  '8a7efe30383ee2f933a68a9883701e3a7bc040ed': 'Spandex - Atomic Components',  // isActive=False, isFilled=True, isDisabled=False, hasTrailingIcon=False, hasError=False
  '1931d2ff2840428b86758747d78b7d0a1e866bed': 'Spandex - Atomic Components',  // isActive=False, isFilled=True, isDisabled=False, hasTrailingIcon=True, hasError=False
  '4e9b69e3abc96e1ba1e0cbdaf18d697628e9d67c': 'Spandex - Atomic Components',  // isActive=False, isFilled=False, isDisabled=True, hasTrailingIcon=False, hasError=False
  '047e20182ddee23693e2c9582c24183b5bb49414': 'Spandex - Atomic Components',  // ↪︎ isIcon=True, ↪︎ isClear=False
  'ab7f3d53993b31d2075f2f0e58f91b4987546bdd': 'Spandex - Atomic Components',  // ↪︎ isIcon=False, ↪︎ isClear=True
  '9d24c31facb20c0099442ecf4e68722f784e5b0e': 'Spandex - Atomic Components',  // ↪︎ isIcon=True, ↪︎ isClear=False, ↪︎ isError=False
  'f5993a69dbe5d023c420d0cc167416dae8a9eb9d': 'Spandex - Atomic Components',  // ↪︎ isIcon=False, ↪︎ isClear=True, ↪︎ isError=False
  'fa229c140052dc58a1a1c3d368c27602aa395a3c': 'Spandex - Atomic Components',  // ↪︎ isIcon=False, ↪︎ isClear=False, ↪︎ isError=True
  '00217dd731972338784d610c5d389ff31ef6e1c5': 'Spandex - Atomic Components',  // ↪︎ hasError=False
  'e5b24d8628d8f2485b21ac257d1e10b61fc9ddab': 'Spandex - Atomic Components',  // ↪︎ hasError=True
  '233bfc892fe24a4d93b194f3c27e1e8005a61d92': 'Spandex - Atomic Components',  // _textInput-label
  '1f7074e0bbaa3ecdc642e8eb5675f9dfdee3a145': 'Spandex - Atomic Components',  // Label Type=Border
  '3dc874a407223ed7f815e13d0ba683e16641c137': 'Spandex - Atomic Components',  // Label Type=Input Field
  '5f0ae1e407adb05c7deae05f8fd0f0a337a0130c': 'Spandex - Atomic Components',  // _textInput-cursor-iOS
  'e79eadb85648f5bc7187dd495e75c15eea4ccc3c': 'Spandex - Atomic Components',  // _textInput-cursor-Android
  'e26f8736fbd34ca8078ea154e9d958b3f81b4391': 'Spandex - Atomic Components',  // Type=Text Only
  '53cc88a462a05d20a3c0d07a02b0d42057c4a318': 'Spandex - Atomic Components',  // Type=Success
  '6a465d96271c109ed2670917bab60c89dffc6a28': 'Spandex - Atomic Components',  // Type=Error
  'e8ca4f8ab12f1273dffedd3f52a24d2565f3d228': 'Spandex - Atomic Components',  // Type=Custom
  '6dfaf537d6b955fda23b064f2a3d235546a62f41': 'Spandex - Atomic Components',  // isSelected=true
  '6b5016acaf3f1fa342d0de6a33752d7270f523c5': 'Spandex - Atomic Components',  // isSelected=false
  '04cb1ba667dde9692d109b9ba7a4e527d2c8ba6c': 'Spandex - Atomic Components',  // Title Bar Shadow
  'b5c9eae1ec783bedfca56f885acd2994da4c6bc4': 'Spandex - Atomic Components',  // Title Bar Shadow thinner
  'f03b97ec0a0be5d76d3af6e63ee1cb1231e6b8dc': 'Spandex - Atomic Components',  // Tab Bar Shadow
  '794bdefd6be2fe5ba5fadd44d78717df62f305b2': 'Spandex - Atomic Components',  // Tab Bar Shadow thinner
  '2629bd5bd4fad76e5c4bcfabadfb5136604c7bef': 'Spandex - Atomic Components',  // isTransparent=False, hasLeadingButtons=False, isModalStack=False, hasSearchBar=False, hasSearchOnly=False
  'a4afa1ff621ce921f46812de58085679df263bb9': 'Spandex - Atomic Components',  // isTransparent=True, hasLeadingButtons=True, isModalStack=False, hasSearchBar=False, hasSearchOnly=False
  'e8da36025fa9bfbe163d3b23270bb7d96196cb32': 'Spandex - Atomic Components',  // isTransparent=True, hasLeadingButtons=False, isModalStack=False, hasSearchBar=False, hasSearchOnly=False
  '2e97fee792649228d2aaa711da0d1a33050c31c5': 'Spandex - Atomic Components',  // isTransparent=False, hasLeadingButtons=False, isModalStack=False, hasSearchBar=True, hasSearchOnly=False
  '830b6606997d108b77b277e8b93f0fea67d98c33': 'Spandex - Atomic Components',  // isTransparent=False, hasLeadingButtons=False, isModalStack=False, hasSearchBar=True, hasSearchOnly=True
  '134360bf14325d45164bf4b1e601796a8703a451': 'Spandex - Atomic Components',  // isTransparent=False, hasLeadingButtons=True, isModalStack=False, hasSearchBar=True, hasSearchOnly=True
  '9a35b69c0894009ab3341ff6265a83c7fc9cc317': 'Spandex - Atomic Components',  // isTransparent=False, hasLeadingButtons=False, isModalStack=True, hasSearchBar=False, hasSearchOnly=False
  '7d9bf0f4cb21586244705568026d83005b4b7352': 'Spandex - Atomic Components',  // isTransparent=False, hasLeadingButtons=False, isModalStack=True, hasSearchBar=True, hasSearchOnly=False
  'ab21cc32ae57114b15e62badd699f76b07906092': 'Spandex - Atomic Components',  // bottomNav-iOS
  '26259fc30437d6c90e37cfa3b938074546dc0b87': 'Spandex - Atomic Components',  // isFloating=false, isCentered=false, statusBarOnly=false
  '3b3857e462178893aa1449e762f1948c92742a8b': 'Spandex - Atomic Components',  // isFloating=true, isCentered=false, statusBarOnly=false
  'dc7da37af4d27d5208e8bbae5ae7e468281f75d6': 'Spandex - Atomic Components',  // isFloating=false, isCentered=true, statusBarOnly=false
  'f47ca811af1300f6f452f7eba68f05bf8ce0fbd1': 'Spandex - Atomic Components',  // isFloating=false, isCentered=false, statusBarOnly=true
  '653cbbe25d85a91a78cbe20eb630a52b979c1263': 'Spandex - Atomic Components',  // Selected=Home
  '8e3ffb652607c7de1313f3e4ff5cd5c3f1b15dda': 'Spandex - Atomic Components',  // Selected=Maps
  '67c89dc8f1cc7e093b1c7e3f92fe8ccca9f3df7f': 'Spandex - Atomic Components',  // Selected=Record
  'd86faa211ffc92afa8490d73fcc86427800c2cdd': 'Spandex - Atomic Components',  // Selected=Groups
  'f96a638cb9eca3a6895601df09ae6ade616f12f4': 'Spandex - Atomic Components',  // Selected=You
  '6f93cf0714221b5362f379199c4e640755028a23': 'Spandex - Atomic Components',  // Active Page=Home
  '884404aa473dc819d5e4ef5ff312961cf3afefed': 'Spandex - Atomic Components',  // Active Page=Maps
  '8b82319d280e14a2a7a27be7c2c6bac8f96ae8bd': 'Spandex - Atomic Components',  // Active Page=Groups
  'd874f600e819b3975c795947a09e1de879de58c2': 'Spandex - Atomic Components',  // Active Page=You
  'f26c4bd71132be7303b51b3dd73b5f76d8a3cd05': 'Spandex - Atomic Components',  // Configuration=icon & label, Segments=5
  '732445c1e2060ae31fce2fe410a581e91eac195b': 'Spandex - Atomic Components',  // Active=True, State=Pressed, Label=false, Badge=Large
  '239908a6ad726f7b1e0bf3c6025e66fc9c9a86ae': 'Spandex - Atomic Components',  // Active=True, State=Focused, Label=false, Badge=Large
  'ffa6ac9b0890dc9a5b105100fb27395b43f77562': 'Spandex - Atomic Components',  // Active=True, State=Hovered, Label=false, Badge=Large
  '8a75edc5d8e3aa64efba0b2b37a90052e6bc07dc': 'Spandex - Atomic Components',  // Active=True, State=Enabled, Label=false, Badge=Large
  '99537d8af52a19090a1c9fff23d526037de0d28a': 'Spandex - Atomic Components',  // Active=True, State=Pressed, Label=false, Badge=Small
  '9c94fb5505f2f5d4a8159813e9b4ddff7b104724': 'Spandex - Atomic Components',  // Active=True, State=Focused, Label=false, Badge=Small
  'df9eed62c1a28c97bb9d9a5a2a6ea7667c0e967f': 'Spandex - Atomic Components',  // Active=True, State=Hovered, Label=false, Badge=Small
  'eff2a70e7371f625f9d3ea055df2fd315965517e': 'Spandex - Atomic Components',  // Active=True, State=Enabled, Label=false, Badge=Small
  'c6d975e662c02976d08f9c3e281418bf4ed34b7e': 'Spandex - Atomic Components',  // Active=True, State=Pressed, Label=true, Badge=Large
  'b58ca681963a29c0dd55853d999cf0d5506f2a04': 'Spandex - Atomic Components',  // Active=True, State=Focused, Label=true, Badge=Large
  '0306fd7fd6ec7d29ae18a160e66c9cd0d63ae3b4': 'Spandex - Atomic Components',  // Active=True, State=Hovered, Label=true, Badge=Large
  '3a4c37a0a0eaf7ed1774cf419dcd4802cb57b916': 'Spandex - Atomic Components',  // Active=True, State=Enabled, Label=true, Badge=Large
  'dd0f28f1fd2ead2d96101d57b2c6910e435e2d32': 'Spandex - Atomic Components',  // Active=True, State=Pressed, Label=true, Badge=Small
  '421cf9d42712708ba68d1f47f8cd8036cd614358': 'Spandex - Atomic Components',  // Active=True, State=Focused, Label=true, Badge=Small
  'ecd066c86701843965ef6209a14fff1183e1fe62': 'Spandex - Atomic Components',  // Active=True, State=Hovered, Label=true, Badge=Small
  'a9366b87787f081986477d33e62f273a32e2ee6e': 'Spandex - Atomic Components',  // Active=True, State=Enabled, Label=true, Badge=Small
  '880c9119a94902c7fb982e9850dcce5fcf1768cb': 'Spandex - Atomic Components',  // Active=False, State=Pressed, Label=false, Badge=Large
  '2cf5ab500cdfe39c50f7cbc6953b4dec6901d255': 'Spandex - Atomic Components',  // Active=False, State=Focused, Label=false, Badge=Large
  'b57ef0f395ee6b62c8f46e4ec5ef87d36cd941cc': 'Spandex - Atomic Components',  // Active=False, State=Hovered, Label=false, Badge=Large
  '65a69c314705ef5c923cdc7b3ae7ec00ef20ff69': 'Spandex - Atomic Components',  // Active=False, State=Enabled, Label=false, Badge=Large
  '348e5da43fbe79c06258c718040e0df514d5aca5': 'Spandex - Atomic Components',  // Active=False, State=Pressed, Label=false, Badge=Small
  'abd7602d37a986db0030b9e15a9a34b90bddc674': 'Spandex - Atomic Components',  // Active=False, State=Focused, Label=false, Badge=Small
  '6031f502a9eefd3e88ed1a06494d9d47554d5b1d': 'Spandex - Atomic Components',  // Active=False, State=Hovered, Label=false, Badge=Small
  '5d33aff8cb65fc12ffe6cbf97ba62e07d09c8a1f': 'Spandex - Atomic Components',  // Active=False, State=Enabled, Label=false, Badge=Small
  '637b8f04fc4c068dc0898782cbc57fa0e259d575': 'Spandex - Atomic Components',  // Active=False, State=Pressed, Label=true, Badge=Large
  '928b05ff1b73392d58aa6be10c9c933207aef5c4': 'Spandex - Atomic Components',  // Active=False, State=Focused, Label=true, Badge=Large
  '92b394731c89e61701eaeb51280cdc692a319069': 'Spandex - Atomic Components',  // Active=False, State=Hovered, Label=true, Badge=Large
  '9a608a0b6d3ca29c45aa7880191a13a7fea4351b': 'Spandex - Atomic Components',  // Active=False, State=Enabled, Label=true, Badge=Large
  '40ea36997499df9a5cfa49d621a2ca6018466b88': 'Spandex - Atomic Components',  // Active=False, State=Pressed, Label=true, Badge=Small
  '534c59698df73cf4a8ca8739bba41377bda1f7eb': 'Spandex - Atomic Components',  // Active=False, State=Focused, Label=true, Badge=Small
  '81cca6d35d110a1fd59785803ddc973dc3ee4ce4': 'Spandex - Atomic Components',  // Active=False, State=Hovered, Label=true, Badge=Small
  'f143b7d26180ff973ef1861a184f0279d19702d7': 'Spandex - Atomic Components',  // Active=False, State=Enabled, Label=true, Badge=Small
  '4f80ac8f66ec70fdf5b83006d1f3808e274b101e': 'Spandex - Atomic Components',  // Active=True, State=Pressed, Label=false, Badge=None
  '596e08496eb3c0f0155058e807989e9624092125': 'Spandex - Atomic Components',  // Active=True, State=Focused, Label=false, Badge=None
  'e1012ca5448caef3b0382f68af25e6be19446aae': 'Spandex - Atomic Components',  // Active=True, State=Hovered, Label=false, Badge=None
  '1490bbcd422070dc2de734ac1a7910a633e8ddf8': 'Spandex - Atomic Components',  // Active=True, State=Enabled, Label=false, Badge=None
  'f854d017206901080ce59a9ae51613632583b0d9': 'Spandex - Atomic Components',  // Active=True, State=Pressed, Label=true, Badge=None
  'b426df284073d54af6ad3ca020ac66899bae4ede': 'Spandex - Atomic Components',  // Active=True, State=Focused, Label=true, Badge=None
  'a9e6bc0f16b790eeabb385a3393999f181444003': 'Spandex - Atomic Components',  // Active=True, State=Hovered, Label=true, Badge=None
  'c11e2f4a147742e8eb56900762abb77d72db15fb': 'Spandex - Atomic Components',  // Active=True, State=Enabled, Label=true, Badge=None
  '1b5dfecd88cc6b8bc7caaa1f9ecf14a500a7e252': 'Spandex - Atomic Components',  // Active=False, State=Pressed, Label=false, Badge=None
  'bf4df424873c6b0c336bc17142d71d0b1e5d9021': 'Spandex - Atomic Components',  // Active=False, State=Focused, Label=false, Badge=None
  '5756d8db1930c89d0f6c800c2d4ced8f98a7c0bb': 'Spandex - Atomic Components',  // Active=False, State=Hovered, Label=false, Badge=None
  '32dfbef8537956d439f9be22c288901de6200881': 'Spandex - Atomic Components',  // Active=False, State=Enabled, Label=false, Badge=None
  '3c43ff6c1ad6ec0c79c539d089c64b8bba8c7f7a': 'Spandex - Atomic Components',  // Active=False, State=Pressed, Label=true, Badge=None
  '07578408e12e563699bed7086d31afe88c872ad2': 'Spandex - Atomic Components',  // Active=False, State=Focused, Label=true, Badge=None
  '2fa84840a399d19fcbb9527b15794792f70c109d': 'Spandex - Atomic Components',  // Active=False, State=Hovered, Label=true, Badge=None
  'fb8352b7b07e933359cd9a0e41d41539d7e81bdd': 'Spandex - Atomic Components',  // Active=False, State=Enabled, Label=true, Badge=None
  '7e31a0a9c907b98b21189a197711040cf441a366': 'Spandex - Atomic Components',  // isBack=true, hasSubtitle=false, isSearch=false, ↪ hasTextEntered=false, materialElevation=flat
  '5143c9101b196a8d697fd67801bf4e021d596d37': 'Spandex - Atomic Components',  // isBack=true, hasSubtitle=false, isSearch=true, ↪ hasTextEntered=false, materialElevation=flat
  '28434bef9ce62eb34e0a86209b397e56bb9dcb9e': 'Spandex - Atomic Components',  // isBack=true, hasSubtitle=false, isSearch=true, ↪ hasTextEntered=true, materialElevation=flat
  '34aca72111e3f5b2c73f5a3dfb9c329619c3c6ef': 'Spandex - Atomic Components',  // isBack=true, hasSubtitle=true, isSearch=false, ↪ hasTextEntered=false, materialElevation=flat
  'd7490563f9602d64b14003373a8e710745749a0b': 'Spandex - Atomic Components',  // isBack=false, hasSubtitle=false, isSearch=false, ↪ hasTextEntered=false, materialElevation=flat
  '59962a3795f1986cf9460e75347ba2add45aa508': 'Spandex - Atomic Components',  // isBack=false, hasSubtitle=true, isSearch=false, ↪ hasTextEntered=false, materialElevation=flat
  '0015cac7a028a502cc6eaf2422c97cb702ef3be6': 'Spandex - Atomic Components',  // isBack=true, hasSubtitle=false, isSearch=false, ↪ hasTextEntered=false, materialElevation=on-scroll
  'eb6034ca20f57189b4055b3d1b0564b1d5348d72': 'Spandex - Atomic Components',  // isBack=true, hasSubtitle=true, isSearch=false, ↪ hasTextEntered=false, materialElevation=on-scroll
  '444bd30f2130dc83217f9787a4153728d30eeee5': 'Spandex - Atomic Components',  // isBack=false, hasSubtitle=false, isSearch=false, ↪ hasTextEntered=false, materialElevation=on-scroll
  '1945103730a7f942cc79aeb4e3e456c74218f3a5': 'Spandex - Atomic Components',  // isBack=false, hasSubtitle=true, isSearch=false, ↪ hasTextEntered=false, materialElevation=on-scroll
  '9a94f8113fd670e10d196b692d537ac06c072790': 'Spandex - Atomic Components',  // isTextButton=false
  '7342622d57f5e7e6b2ddc4bdb9bb5a2dcfc90c74': 'Spandex - Atomic Components',  // isTextButton=true
  'ec9c519408f290e8ff048b46eb00adaeaaca07e2': 'Spandex - Atomic Components',  // Enabled=False
  'cfd101201b5d9feec09097c5d273cdc98012109e': 'Spandex - Atomic Components',  // Enabled=True
  'a7bead91f00c4761bdc0f475a0a02d3562259d29': 'Spandex - Atomic Components',  // State=Active
  'e90d091039193680cfaaaa10f11b481534b84eaa': 'Spandex - Atomic Components',  // State=Filled
  '2ace429068c2f0f909ac1c046dface6b26f9f651': 'Spandex - Atomic Components',  // State=Focused
  'c0f4ce64278f5a02541bb12238826d31a5c2b743': 'Spandex - Atomic Components',  // State=Placeholder
  '01e42c1c9d3e27cdfdbb0aae0c9d77f84d397f5a': 'Spandex - Atomic Components',  // _Prompt
  '8cc90abb19bf45c73b70f7560ba37090e28ed6c8': 'Spandex - Atomic Components',  // Buttons=3,isFloating=False
  '708f94a25aa75198f41db7ce5c9bc1152b89a7be': 'Spandex - Atomic Components',  // Buttons=2,isFloating=False
  '681def688e51f780cb6951730ea9f2bedd26cdcc': 'Spandex - Atomic Components',  // Buttons=1,isFloating=False
  '3db14a11b0c6403f1194f97dde3df54ce1c8f772': 'Spandex - Atomic Components',  // Buttons=1, isFloating=True
  'af85df1449780df6a97b49875adb5bb2a0436d8f': 'Spandex - Atomic Components',  // Buttons=2, isFloating=True
  'bc10cd74b666e1bfcd036add0b9ae785dfcac13d': 'Spandex - Atomic Components',  // Mode=Dark, Vibrant=True
  '87a0bd9099abd385c7f08a5ad3e4968e638b3ee8': 'Spandex - Atomic Components',  // Mode=Dark, Vibrant=False
  '77cc5c697188876fb57043e36f666bb4a815245c': 'Spandex - Atomic Components',  // Mode=Light, Vibrant=True
  '35fd234d403b5057e49ec5a155007e3b17fc472c': 'Spandex - Atomic Components',  // Mode=Light, Vibrant=False
  'e5c220c3bdc3a029b77f4291dd29ab334dea739f': 'Spandex - Atomic Components',  // Buttons=3,isFloating=False
  '2592949d29d467f7b743b59cf5d8ef241b4c5638': 'Spandex - Atomic Components',  // Buttons=2,isFloating=False
  'c8d7d4907e21ab2714e9dc5d3467f8056d2a705e': 'Spandex - Atomic Components',  // Buttons=1,isFloating=False
  '8c3b8e5a91c03bc3ddf69c263ae0942e3fd8295e': 'Spandex - Atomic Components',  // Buttons=1, isFloating=True
  'faf99e08138cbd16252102c82934b2095c0f9a0f': 'Spandex - Atomic Components',  // _Avatar
  '8d6c2d9925af854392d70c5dca3879b8852e9468': 'Spandex - Atomic Components',  // Type=Text - Default,Enabled=true
  'c37d4904660c5331b0e88ccfd54417e5fd83662c': 'Spandex - Atomic Components',  // Type=Text - Default,Enabled=false
  '82471e801819f97a1967eabb45da583c535ed264': 'Spandex - Atomic Components',  // Type=Text - Emphasized,Enabled=true
  '217516061160fac1f95c3f0a35d8216950641c23': 'Spandex - Atomic Components',  // Type=Text - Emphasized,Enabled=false
  '0246588aae72d0418a87a4974d2d0ba2bb26a328': 'Spandex - Atomic Components',  // Type=Symbol,Enabled=true
  '238895f4ae838cc07b4c98652069e8ce8f9bacbd': 'Spandex - Atomic Components',  // Type=Symbol,Enabled=false
  'a421192b66d5d839c321a9aee980e5f48ef442a0': 'Spandex - Atomic Components',  // Type=Image, Enabled=true
  '2458682e526b9204e95aff40f6cffa4c4e264a38': 'Spandex - Atomic Components',  // Enabled=false
  'c60ee66b98c0741880b1354b13840f7c59a105b8': 'Spandex - Atomic Components',  // Enabled=true
  '1872121b72724049e5f1bc1b5587aa817872d821': 'Spandex - Atomic Components',  // iOS Status Bar
  '655b8a343b93549d6b963149dd27c7551da9362c': 'Spandex - Atomic Components',  // Dark Mode=False, Charge=100%, Charging=False, Percentage=False
  '80e8a49253f089e1d33588e0a6c0f93a7bb8a80d': 'Spandex - Atomic Components',  // Dark Mode=False, Charge=70%, Charging=False, Percentage=False
  '1531e96e3b2a1ec1a71eb9bcba4553967afa25cd': 'Spandex - Atomic Components',  // Dark Mode=False, Charge=Variable, Charging=False, Percentage=True
  '4932fa877a3c98c4b99fe04bb6f9dc27bb4a539f': 'Spandex - Atomic Components',  // Dark Mode=False, Charge=70%, Charging=True, Percentage=False
  '0e507eb68444f9b8c0ff883e41c6406fb7d66992': 'Spandex - Atomic Components',  // Dark Mode=False, Charge=Variable, Charging=True, Percentage=True
  '8ff8d61b8823d10386fc458c4ed2726ad5e49256': 'Spandex - Atomic Components',  // Dark Mode=False, Type=Default
  'dd9050b5b5b530992632a75db53f5810b1c1addf': 'Spandex - Atomic Components',  // Dark Mode=False, Type=Focus
  'f5d589587c9f4fc9947b13127441d4f3d2117b6a': 'Spandex - Atomic Components',  // Dark Mode=False, Type=Green
  'b96c3f733df4bd31d057dad166ee47e8f0fbf7d1': 'Spandex - Atomic Components',  // Dark Mode=False, Type=Blue
  '3423624255435f4b6ee908dc5a921c3631a99f6e': 'Spandex - Atomic Components',  // Dark Mode=False, Type=Orange
  '9873b0bf97ce6291d39fac6bcb2baff75e276fb3': 'Spandex - Atomic Components',  // isCancelable=false, isPlaceholder=true
  'fca37b2e00d7cc2c14b5b69b5a5c6cbdb4cde09d': 'Spandex - Atomic Components',  // isCancelable=false, isPlaceholder=false
  '114fc9d0b3f1ac2c4aebf8c0e44c361ddfd9ed65': 'Spandex - Atomic Components',  // isCancelable=true, isPlaceholder=false
  '9c1f4c2e8ed000014d784ac40db90bac15e945cb': 'Spandex - Atomic Components',  // isCancelable=true, isPlaceholder=true
  '1e25b4d30e01c871c5e1a8e3a0d85c1484f2b6d1': 'Spandex - Atomic Components',  // isCancelable=false, hasTextEntered=false
  'c909d38a9439b57584bc524b152478f9679f12e1': 'Spandex - Atomic Components',  // isCancelable=false, hasTextEntered=true
  'cc69cf8b3f0eed3873b57dfaaa5677360794f032': 'Spandex - Atomic Components',  // isCancelable=true, hasTextEntered=false
  '5d2366f6420baf28621008194041a4f52ce2303e': 'Spandex - Atomic Components',  // isCancelable=true, hasTextEntered=true
  'c98ed4dbc59c62af04289ccef23e8351345a707b': 'Spandex - Atomic Components',  // Amazfit
  'a3adfc0cfba7ebc27f67dd331bfd33171a50797d': 'Spandex - Atomic Components',  // Apple Watch
  '337039370f51879c417a2b6daa8f2de8ca3cdabb': 'Spandex - Atomic Components',  // Bryton
  'ad31db75816131f2f2c0f2c999280b9c882b41d6': 'Spandex - Atomic Components',  // Coros
  '05fdb29290c14c0405869497dbcbc34c77db555f': 'Spandex - Atomic Components',  // Fitbit
  '519ad2eb183844f6c87c8c69d1a400a0a8eb9711': 'Spandex - Atomic Components',  // Garmin
  '2e893abb76844d86119931f9d210c993ae8061f4': 'Spandex - Atomic Components',  // Huawei
  '77906c7381aef71503b028e11c56c953977013c3': 'Spandex - Atomic Components',  // NIKE
  'd10c09cdba3a2714e43a8f51394deee242db1eb0': 'Spandex - Atomic Components',  // Oura
  'a99e7c78a290bceb2da14ddf3559645cb74ae888': 'Spandex - Atomic Components',  // Peloton
  '6b0fec0f10d3d132fc01cb0e73abf79145a35976': 'Spandex - Atomic Components',  // Polar
  'e284a9c7d51f7ec66f33ada8da21c11d72388640': 'Spandex - Atomic Components',  // Rouvy
  '77d9eeecc1eba681ff90731bf46f5a6d14fd5bda': 'Spandex - Atomic Components',  // Samsung
  'b64424d9f65f51ca4f90e25973cc91da1fbc81f9': 'Spandex - Atomic Components',  // Suunto
  '641c01665a0b71f3f2a7d136023baea75e0e62f6': 'Spandex - Atomic Components',  // Tomtom
  '0dba0a5cb83501fcccfabc73ef19427a16301b0b': 'Spandex - Atomic Components',  // Wahoo
  'cc7f756919d1c1f34a184ba73e5c9ee582dba12c': 'Spandex - Atomic Components',  // Whoop
  '4201ab70d3834768564f1179a6486f4bf4e9d60d': 'Spandex - Atomic Components',  // WearOS by Google
  'ffe6c240b66d35b0e0f8b715497e38d1f0459c39': 'Spandex - Atomic Components',  // Zwift
  'd03e523322ad6769bc7123fd1d325c748592012b': 'Spandex - Atomic Components',  // Amazfit-darkMode
  '8e3452243b876744b7225a0d76c2868db9f8d91a': 'Spandex - Atomic Components',  // Apple Watch-darkMode
  '4368c132a624fe9998eacc71e6f117958a14001f': 'Spandex - Atomic Components',  // Bryton-darkMode
  '59ba464ae6fae4c3d34d324d27cf4fc6984dff38': 'Spandex - Atomic Components',  // Coros-darkMode
  '047522c1331946abf220a05cf7c1c198ffac91b2': 'Spandex - Atomic Components',  // Fitbit-darkMode
  'db74ea4f454983674148cb4f5575a691b2ce6f43': 'Spandex - Atomic Components',  // Garmin-darkMode
  '0ee0f620dacbe0b5ad788e3e5d5e4f8164982b1c': 'Spandex - Atomic Components',  // Huawei-darkMode
  'c4d7001d725c86f129827c49b95df0102c1e2d58': 'Spandex - Atomic Components',  // NIKE-darkMode
  '7f26fa7fb77e19d7d289c23125eec5ead1907050': 'Spandex - Atomic Components',  // Oura- darkMode
  '3c6d8bb3971e44e5bf2f9d6f320ab6e4cacac605': 'Spandex - Atomic Components',  // Peloton-darkMode
  'bfd801c16b44b18022c0f2dfd985d03c8273e958': 'Spandex - Atomic Components',  // Polar-darkMode
  '5e498ace7277bfa1b18affe82da07a6ddecd4f65': 'Spandex - Atomic Components',  // Rouvy-darkMode
  '15295045367410668b331e7c87b7e2297ea0843a': 'Spandex - Atomic Components',  // Samsung-darkMode
  '6c98d2012c37a77f0850eb5eac31f8458899bed5': 'Spandex - Atomic Components',  // Suunto-darkMode
  'a15af61d4070ee2348935d5ed1ec59f259c381c9': 'Spandex - Atomic Components',  // Tomtom-darkMode
  'a77ec2ac8d3ebe10ba33ef14d50f88841d6dc138': 'Spandex - Atomic Components',  // Wahoo-darkMode
  'dd15a1f6bb7366c496c623f86789c3972bf9348b': 'Spandex - Atomic Components',  // Whoop-darkMode
  '05b86341111144f6ccc1565a76e9f5f83c5cf632': 'Spandex - Atomic Components',  // WearOS by Google-darkMode
  'a0fb2d7acefb608e789ad7e99801e567f08595c4': 'Spandex - Atomic Components',  // Zwift-darkMode


  // ========================================
  // Spandex - Global Foundations Components
  // ========================================
  'de8194d51a81b8c17a3da4674154361aecaa9f19': 'Spandex - Global Foundations',  // Color=Black
  '19c49b8aaa494787607db00adccb706fe4d29878': 'Spandex - Global Foundations',  // Color=White
  '77e501c640582b75431c2ec5b6361575fceb3fd5': 'Spandex - Global Foundations',  // Color=Orange/Black
  'f31f881569d4edf220ed5f96ccad31c1df597b70': 'Spandex - Global Foundations',  // Color=Black
  '64ff7ab90223c74db1b48fc2506b0cd63826ecbd': 'Spandex - Global Foundations',  // Color=White
  'e045afc02be8802b0e2341ff95a2d1fa15d2e7f2': 'Spandex - Global Foundations',  // Color=Orange/Black
  '134a74a155276b04b4eec9529694b7308f769fc1': 'Spandex - Global Foundations',  // Color=Orange
  '8171552067e5c5534af3c9819046e897e5f141b8': 'Spandex - Global Foundations',  // Color=White
  'ff03fd92ea2f55eaac584a5dfe12b9f0fc6b902b': 'Spandex - Global Foundations',  // Color=Black
  'f35588527b549577a752d1a2b1441ee3f8a62322': 'Spandex - Global Foundations',  // Color=Black
  '5d364c6ee921a14c5da88b13dacd034475ff9321': 'Spandex - Global Foundations',  // Color=White
  '0616424a1e955aa9781f186165c33025961ed5dd': 'Spandex - Global Foundations',  // Color=Orange/Black
  '6f8cd17b099c7c1bd5a34818f56380fb22e7300e': 'Spandex - Global Foundations',  // Color=Orange/Black
  '2e1acb60384df1100bd497158586176add9f875d': 'Spandex - Global Foundations',  // Color=White
  '62e44be7e9fb3f47c2829fb6eed434434aae0db4': 'Spandex - Global Foundations',  // Color=Black
  'f9bbe46d1b319fca712e7bbf4b4e6a69c5c32ef3': 'Spandex - Global Foundations',  // Color=Black
  'a5fca55b1c5634f37a07e743ff5027085ba53088': 'Spandex - Global Foundations',  // Color=White
  'a49b78071bacd5af3376089a9a8450bda1649be7': 'Spandex - Global Foundations',  // Color=Orange/Black
  '2cd54bbd939e8e8fd172ca6c362d395961d1724a': 'Spandex - Global Foundations',  // Color=Orange/Black
  '289ff522448362fead60b5504b827ba0ff115a2a': 'Spandex - Global Foundations',  // Color=White
  'fa5804bb3106581fb9870c5db76ce072eba5833b': 'Spandex - Global Foundations',  // Color=Black
  '08b19e5ac21c76b912e6530dad4fba7401763bc1': 'Spandex - Global Foundations',  // Color=Black
  '8dd705d186a69311d41bc4eab965dfad463c8fa3': 'Spandex - Global Foundations',  // Color=White
  'be89ab9c51a8f24da17fb03197e4358666fe18fd': 'Spandex - Global Foundations',  // Color=Orange/Black
  '5005227f42e51b17e5ac1928705b95d468c903fb': 'Spandex - Global Foundations',  // Color=Black
  '0ec097f0d9373e5c9116d3e4f117a8daee50934e': 'Spandex - Global Foundations',  // Color=White
  '698e412a4f1c4240d6cdf5ca69c61fd29c10b0be': 'Spandex - Global Foundations',  // Color=Orange/Black
  '5cf2365c48d8a137c1785a497151962401e20208': 'Spandex - Global Foundations',  // Color=Black
  'a9275ab0c14475bda24dd36c214e9d9a638953df': 'Spandex - Global Foundations',  // Color=White
  '0e8f8e3f3950df9eb0173dbc17898ceafc3e3f7d': 'Spandex - Global Foundations',  // Color=Orange/Black
  '633c500618a1f7709146aeee39ec77f33f1e9b28': 'Spandex - Global Foundations',  // Color=Black
  'f4e0988101e499ea5e2961129a7431de886dad11': 'Spandex - Global Foundations',  // Color=White
  'f8b961c6986f1709ef17762eeb6950118beb8f63': 'Spandex - Global Foundations',  // Color=Orange
  '72baefa31ebbb382c9df23ea6e11ab94191e3c03': 'Spandex - Global Foundations',  // Color=Black
  'f93164b4b1e28aa11aa280b19e2429373dfee828': 'Spandex - Global Foundations',  // Color=White
  '2c3dada0d2d5c54548de77971583f808bb3c8893': 'Spandex - Global Foundations',  // Color=TT on Light
  '3fa12b2d7f36fbef64c5c47c2467cb7eaf3febd1': 'Spandex - Global Foundations',  // Color=TT on Dark
  'e428773a6843a80979fd3f4f7183325b1b09764a': 'Spandex - Global Foundations',  // Color=Black
  'aa42e4e24e296bce0d409004c662a09680323b2c': 'Spandex - Global Foundations',  // Color=White
  '877a30ae16ba0485948f6a5569106e1c2843ce05': 'Spandex - Global Foundations',  // Color=Orange/Black
  'd0c8d763d8588eced6797475d9df096a46440933': 'Spandex - Global Foundations',  // Color=Orange/White
  'e0b7b848833260d40cf7c36ad07eb93af91a7987': 'Spandex - Global Foundations',  // Color=Orange
  'd2d6f21e1f598428d03fcdddb67bc81696c01d02': 'Spandex - Global Foundations',  // Color=White
  'c7614f52381d1f6b7c9615b01879ae891b46db03': 'Spandex - Global Foundations',  // Color=Black, Style=Stacked
  'ec6d089f56a667903b3e9e4543bae818e368314f': 'Spandex - Global Foundations',  // Color=White, Style=Stacked
  '1c00bb636869f8c3b95469fa1e57457dbd5da716': 'Spandex - Global Foundations',  // Color=Orange/Black, Style=Stacked
  'd044f1ac23360a1cbaac250637c030480f12b65a': 'Spandex - Global Foundations',  // Color=Black, Style=Inline
  '62af4df4d35543b5b658eb70f945191a10183b78': 'Spandex - Global Foundations',  // Color=White, Style=Inline
  'c7d2b92f6ec1875b85612754dead70ad5629a0e8': 'Spandex - Global Foundations',  // Color=Orange/Black, Style=Inline
  '9002c5ef4f61cb305e13023ae85c20a703b97cdb': 'Spandex - Global Foundations',  // Color=Black, Style=Stacked
  '48ff0c921cf6d3686d17d8ef505008cd93990afd': 'Spandex - Global Foundations',  // Color=White, Style=Stacked
  '420febf58775cb64d5df6b4c09fd1afaf1a63eb3': 'Spandex - Global Foundations',  // Color=Orange/Black, Style=Stacked
  'd7c5a0ce691aee57b9ef021b5a9d35ee7754059f': 'Spandex - Global Foundations',  // Color=Black, Style=Inline
  'ecef4c60e18241547058040bfcd5753e3a6567af': 'Spandex - Global Foundations',  // Color=White, Style=Inline
  'f1ee597311162783ecda4e31508205d04f42dbc9': 'Spandex - Global Foundations',  // Color=Orange/Black, Style=Inline
  'aa76f7e030259bee59c52c98e03cd099d86df69f': 'Spandex - Global Foundations',  // Color=Black Tinted
  '7ad0d2a74d2973de7c1afe3510c533e6e33014e5': 'Spandex - Global Foundations',  // Color=Black
  'efdf444da356b808b2417fe5ee298d2daa435bb9': 'Spandex - Global Foundations',  // Color=White
  '2ef866c7f4cfd258588064793a818fa8ecec1297': 'Spandex - Global Foundations',  // Color=Orange Tinted
  'b07f770a4ce8775a50d5fb547dfd661f01b7dc42': 'Spandex - Global Foundations',  // Color=Orange
  '110b971d3bd27961ae628069c77aadcbccce2173': 'Spandex - Global Foundations',  // Color=Black
  'be8b857c1b8b1157e8adac3d8bbe6d3b73208b08': 'Spandex - Global Foundations',  // Color=White
  '2f41768da8e3db900e615fa56f7dcfee6747e492': 'Spandex - Global Foundations',  // Color=Orange
  'e5db3bbd40f501d239e6e17114a9bc458d2ba109': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1636d73bda5b340cbf5139fefb30584a2600d3c3': 'Spandex - Global Foundations',  // size=sm (24x24)
  '177793ea113f19855cc7dda8c69a4c87867b36f9': 'Spandex - Global Foundations',  // size=md (32x32)
  '0cb37b45b343de2acd1b9f34db4dbbfdd7856c20': 'Spandex - Global Foundations',  // size=lg (48x48)
  '27645026250b0b5d33416aa53e228265f355048e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '38ce5b342d839792acd77e99c589f35cb0945209': 'Spandex - Global Foundations',  // size=sm (24x24)
  '774cf31d3906134cb3dc83173a7cdb063e9939ec': 'Spandex - Global Foundations',  // size=md (32x32)
  '7e83166f5535530e8d3106c1155e72a12a3c45f2': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0bfbbb29b8fb8503b488f822e39e2fd4dd76fd74': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ac269ed2510d37cf458f1c742ec079322265b141': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f382f545e4f252b9bb90f800af0767cdd289c2fd': 'Spandex - Global Foundations',  // size=md (32x32)
  '5a2ec9f13ac1c8a43d4247766495aa5f30eb4d1a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd4f201d4df76e49f2857f799ccbd6d24616edfac': 'Spandex - Global Foundations',  // size=xs (16x16)
  '35498f1cee2a35237514f90f1d322eb1d9f6a224': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3dd45f212385691781c8afc3b215218220855f44': 'Spandex - Global Foundations',  // size=md (32x32)
  '3f0714190edf2b507fca7077eb33f0b6b1a4ed82': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cb1aec354b9d00b0f5b854e822e4c68ee40a5bc5': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ed7875779385f33fd62c6c6d648a1d10ddc80bd6': 'Spandex - Global Foundations',  // size=sm (24x24)
  '850b1414d9d52704d717d91f1e36a4a0f6a48892': 'Spandex - Global Foundations',  // size=md (32x32)
  '800f6ce7448820e1df64cbbb1f47f93b7a046add': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1a858759e8593101d6789f5a64152a3295ddf15d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '50e53af21df3f01926461caaecf53f588589a988': 'Spandex - Global Foundations',  // size=sm (24x24)
  '95b8a41e5e159e657a583ad029ce5af1671e9290': 'Spandex - Global Foundations',  // size=md (32x32)
  '22d8115be10a30a915372155d4dbbb0cf2d96db4': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4a17668156a688039d232c42c1adf03f29a5437c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f8c35fc1726c50b71783c9666bfb441284755d18': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8b7c96a46ca4ad64ecb34ab2bac20a39f69bd87f': 'Spandex - Global Foundations',  // size=md (32x32)
  'df194383d754df7d894f1a00656864c88f0e32b5': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cab00ec729f87be7cde4d87ce622f31987402fa8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7e80b01f4ad556f2b4c688805668e50d0052a5ab': 'Spandex - Global Foundations',  // size=sm (24x24)
  '63735cc98b76953a48419e53948abc5af4f521a0': 'Spandex - Global Foundations',  // size=md (32x32)
  'b697238b445725e9d43fdbcdd922e2bdc9fdc256': 'Spandex - Global Foundations',  // size=lg (48x48)
  '981baecba784eb665e916ea74a8f90913622ee1b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1a859b9c7aaba53f48eb93ce92f31c38fb0e995b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9105d31decd3d9f1da0982d491ec3ee91b444b82': 'Spandex - Global Foundations',  // size=md (32x32)
  '2dba392f437863ca2ff6c466b5d13f802f38c738': 'Spandex - Global Foundations',  // size=lg (48x48)
  '47bf715a624ba8d5dbd96179d8e43793ce9693d8': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aaf1e555b784f1e1a584caaa13d0ed2522f3ac4e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5ece047f2a64eddcebc63acb0ec721c30051a19a': 'Spandex - Global Foundations',  // size=md (32x32)
  'aa90e47400aecb2978138bab5c620661a7001621': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9054d3be2f3c737b2e034b750789044b6b05cf1d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '04b98311239da55e26f19f2294bbfbce8c0fb5e4': 'Spandex - Global Foundations',  // size=sm (24x24)
  '89fbe860c3195c9b9b44ff4843c6b616cf5ee355': 'Spandex - Global Foundations',  // size=md (32x32)
  '4113228305129b3b89f060b8f40aae86b0130432': 'Spandex - Global Foundations',  // size=lg (48x48)
  '298d442587fac8b4ff8b7d228a8a9a7650145f97': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f6f1eee6f4272c55ca219f46998ed975966fb3bd': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd5b09642394100fb6e2415c4002a1d949ba99deb': 'Spandex - Global Foundations',  // size=md (32x32)
  'fa75ebc642fd8b05bd377dd09c2fef42bdc27401': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5276c35d601272f89954330e3db5f3f4ac7f20b2': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fd06e4a143ee8439e1d5866250bb36555364dcab': 'Spandex - Global Foundations',  // size=sm (24x24)
  '108d082af860ab6d05f6d7f44ecee2783997fe50': 'Spandex - Global Foundations',  // size=md (32x32)
  '32c70f3c7728b7acb4edaed3fb75d2d397be969b': 'Spandex - Global Foundations',  // size=lg (48x48)
  '90af3eebad658f52dd2f81fcef17bcf5334e10ad': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c736d36599161340155f9a32fc38e9296e4d7440': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b2374de75625868bfc43a592d5dd21cb94c707b8': 'Spandex - Global Foundations',  // size=md (32x32)
  '64e8325fad4daa058bf1a76e20a5e99e965733ad': 'Spandex - Global Foundations',  // size=lg (48x48)
  '11e584e40d55a9b35b61d1730b876bfcd8ac8c9b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '94179b8a9bca93a2728a60ce04c90af71657ab8e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '374a9ab0c289e612d04f6c497fc37add52bbcd77': 'Spandex - Global Foundations',  // size=md (32x32)
  '077bab4f71f2923e07da7c70b64e244f7fb1e084': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7c44c7d382e429580902ac125bbc264fc25ca351': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5c800e2a1d4fa7cf0f35c936fae36ec00fc75e85': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f071dcbebd3aa2a3abffd4cb1439d0717b812e91': 'Spandex - Global Foundations',  // size=md (32x32)
  '87dda6586bee9c7e98bb6d638e6aacbd6201b468': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c363abf992c2020d1cd532371dd03de82d695723': 'Spandex - Global Foundations',  // size=xs (16x16)
  '80639878373ba8ec918d352ce1ab7d246c8cf890': 'Spandex - Global Foundations',  // size=sm (24x24)
  'dd99a36d85465e3eabb26857f822a8d572cb4f33': 'Spandex - Global Foundations',  // size=md (32x32)
  'e7bbbf044dd89307159a0af61b588ee1766a16e3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6fb1c4a32f0b0e9681ae3994e148716278acf87e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1df4d9bc8be4f23a75238162c071fd97961b310d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8bf29d9687421badbf64645413e42dbaf1d8f246': 'Spandex - Global Foundations',  // size=md (32x32)
  '7e88c0d78d13f36c1d0ca83309f3e99bf3e38ba5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8f5aef927f1d830f1f7cdef9572dd106d5212092': 'Spandex - Global Foundations',  // size=xs (16x16)
  'db1ec92630f5c0b6a9038de8d2eddadffeb5be22': 'Spandex - Global Foundations',  // size=sm (24x24)
  '582a17102afd8c610b779d23808aaf4ecdf3fe16': 'Spandex - Global Foundations',  // size=md (32x32)
  '8c31989fa35bf046b9f05d1be94d17ad66eda6f7': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ae9fa0e99d4652add3f1b2e766595bdc7f366193': 'Spandex - Global Foundations',  // size=xs (16x16)
  '86a35c9bafc293fa546e42ab4de3500a0b619398': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4bb9bfb08142b8fc6e8da8e77820a6db0b938004': 'Spandex - Global Foundations',  // size=md (32x32)
  'e7a051e2db0503963478269018bab91bf7401bd7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '554934a3752a0c9324571f0477bdfafa47bb6856': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8cfa87bd429b7f72253be2a4cce56456d51d2f38': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7d98bcf1dbb0abd68cdc668976a3a5c3402faa92': 'Spandex - Global Foundations',  // size=md (32x32)
  'c72643094dfda41d284be625f2c81e4e46d73204': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8034a3c0be6672c518c6437f211125729c2b7701': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6ba2660cd69b90f5248c0c5f6024a522c851d3c0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '44a2aacc58c9c224627d8ba00871e76c2e9c2005': 'Spandex - Global Foundations',  // size=md (32x32)
  '79bd9382db08a9814146892a78c547f4fe50d1a8': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ac701d1f3e14df39d6a72647717ca121e92bf5f2': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f495457edc1ed39a3fce297e0d96407524f3e924': 'Spandex - Global Foundations',  // size=sm (24x24)
  '457c11d2cbc309dc7a50141ae13e1f1d96423e0a': 'Spandex - Global Foundations',  // size=md (32x32)
  '4f4ec7d244b238e263fdd8779ff0953eac7802c7': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b441b867ddb28557a12e03565a4aa97e85d5b956': 'Spandex - Global Foundations',  // size=xs (16x16)
  '858f67b4792cd2b5cc68265dc6ea116ae9becf84': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7df3371c214f65dff0ad07aaa1ec20739a2f6fe7': 'Spandex - Global Foundations',  // size=md (32x32)
  '685da3d2c46a7dbdb427655488784fb7544747fa': 'Spandex - Global Foundations',  // size=lg (48x48)
  '340fbfc03ba41d0c0acdbb54e6de54e1f2a64105': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd1a3f4d1f64aacb2b9206ec0c2902b44f79be051': 'Spandex - Global Foundations',  // size=sm (24x24)
  '65cb841eae0b547bfd9cedf74d1f8f61435295d8': 'Spandex - Global Foundations',  // size=md (32x32)
  '29f247a96a22632f32782c2ab4616cae7e5c9e2d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '03f3ed9688a8663a8e9af7d97c5314367278982a': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f54904d2efc31ee3fa0357fcf811233e38556545': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f854a847bd8a0ef674f8921b9f02e3fd7b8ad5c2': 'Spandex - Global Foundations',  // size=md (32x32)
  '652232684cd4be899a7f012d30ec0dd528a85fd5': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f12bac6e56a8342b241a1341da28e0b5d495970c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e1b43501ef417baa24114b740fd41a54cc020566': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4540d0cc13ee1ca515fbd4c44cd13553c999e438': 'Spandex - Global Foundations',  // size=md (32x32)
  'a9e33a969c5696d91045f481d3778678f217a720': 'Spandex - Global Foundations',  // size=lg (48x48)
  '76385dd215a3d476ad1d962445e7878ac5acd665': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fafc8fbb1f6e392216f51b8d2ad760d338ef400e': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cc71f3129d2b439c91b89c034a58a1631a3cd186': 'Spandex - Global Foundations',  // size=md (32x32)
  '082b18de6726626457c80067eb28f0b5065d66b3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '42b0cfc3ed5be5081bcdfd9594f89410d9893b52': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a059ed3e9e364992fe1fb43c154939ac5964b8eb': 'Spandex - Global Foundations',  // size=sm (24x24)
  '57f0aff0cfe5d0b1e7a2bf38a4b26c0007fe1b31': 'Spandex - Global Foundations',  // size=md (32x32)
  '9f073c8437757ab1fafc02ac8b176ac5398703df': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a42cc3b2ed399c5aa96a5f02e17417d5d88bc996': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4850517e8bf8fd3bba757655f1f2212a9d59871a': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b41368f73a6f70af3472c611e95e398d61100ee3': 'Spandex - Global Foundations',  // size=md (32x32)
  '58c72fd7957590ffdcdb586c91d5aa047adf2b0a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '00c7da7cb77513af12231541156af11b7ade2750': 'Spandex - Global Foundations',  // size=xs (16x16)
  '46f86a4dab8602883d96aa9ff0885b0d3fcc6898': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7bde32bb37d295eddb624a3afe1b78880af67c2f': 'Spandex - Global Foundations',  // size=md (32x32)
  '7a8263b4ec4338ee0ce561f89500266210906768': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c0f1ff974647f8688c6d17525a1f43d8d837c064': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e7569fdfb4c2826a7d16ed8ef9678864cf15b502': 'Spandex - Global Foundations',  // size=sm (24x24)
  '95233c72208b0de4bd3c47711c5f3ff5c0930f8e': 'Spandex - Global Foundations',  // size=md (32x32)
  'f042fb8bba2fc02fc448311d3c66a90d73dbbcd1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '496bac7944280ddd1ed9fa8b8ce895c61b61deee': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ae23ee27632eb43c837930488aa5c73ff6760dac': 'Spandex - Global Foundations',  // size=sm (24x24)
  '14ef15247f4ba908ad75ad0e188336f9f3e88891': 'Spandex - Global Foundations',  // size=md (32x32)
  '0e355f1646d5e845a0d13682b4fc5c1862978b43': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f95249d6a0e20ed3e27ea025d989a5261d98a07e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '93e6a9ac572f8a0ef1844802e31e5111abbbc9be': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7a21bf018dd3243a61bfcea8a1f2a3251c17a82b': 'Spandex - Global Foundations',  // size=md (32x32)
  '1d1bcbff343f5e8eeee3236d907e6a165ced1b7e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1be4df08d39319a9d45f1567e9f07774b2773cc6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8f051dcbdd1d28654d524d42226e0a0c32de3bf7': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9987fa2c18892b873d187c7eb2c0b868bc6ad87f': 'Spandex - Global Foundations',  // size=md (32x32)
  'd01323e75589d98193163e3d322995c8f16e84c7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9ef082abd5c0e3df666bb6fda93c411583f3e81b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '43b01e1d09add38126125fa1b709cf0669ce0731': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b3d408a0c302ca94fc39675ed31b9975bef81f14': 'Spandex - Global Foundations',  // size=md (32x32)
  '5788415d7d95b21b1491a51d687e2b7626510000': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4bcbbde88490724cd5ebaa63547e3995295a52ac': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd788ee4b05296fb5dd0294e19160a55d2a76de1b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '408cbcb4902c14875748429782447026734d33d4': 'Spandex - Global Foundations',  // size=md (32x32)
  'd356ea6bb2085b7e9cc722fe8fd2d5f19d0c552e': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b7165e4121b9d42843358151c6892039c9b9bbf4': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c8a0997d7d591668d04eec0db18008b0b7d6d58c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '497075572b53ca8c273226769a38f3112338546c': 'Spandex - Global Foundations',  // size=md (32x32)
  'ae68168d2a25ea04e02bb793c71ed1b53c3a970a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c40ac4407def331556d9dd76c8e82db47694a5ff': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0cd79d81b0d6d05be32b62825c2a81b2e2954373': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4536798c0c780d71c392cff28104a72999406025': 'Spandex - Global Foundations',  // size=md (32x32)
  '210faa59e9807c710074a296a24799d8d5d9136e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5286b932495f9ab836f79c968748ddc879c8ec16': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0d1e31b43a293c7d5c661d88937da8d146558e47': 'Spandex - Global Foundations',  // size=sm (24x24)
  '241ce5617f7ccae57910d9f6c6e6b83ce03ccf04': 'Spandex - Global Foundations',  // size=md (32x32)
  '319b2575dc8096cd09f7b3b143ec303aeae4e779': 'Spandex - Global Foundations',  // size=lg (48x48)
  '299d9b2c3478fc79d1440bee22695599dd4c4462': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f276cd01b21a3f84781efba5596a168a999ec9db': 'Spandex - Global Foundations',  // size=sm (24x24)
  '391454f28f9bb38c94bc572fa597ac7410000f1f': 'Spandex - Global Foundations',  // size=md (32x32)
  '1b41da645642ab665b3994484f56e1269eb7d787': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2485812303fae8e714dcc3043e424189eeadd300': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1757e7c20ec5026940ce1131576818b7b5f68e28': 'Spandex - Global Foundations',  // size=sm (24x24)
  '74b9c0bd07dbf732fa933f45fb952f30c80b741d': 'Spandex - Global Foundations',  // size=md (32x32)
  '2bfdd843b2f8f9be53d933f8ba4b02e93109735f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '22f64529484af915bb17e8818d5bdf22133d436e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5306259f7e0ecf8a4a938767d00ad17f4923d15c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '35ef2cc243cab536c826743b5652d2f5bed73f98': 'Spandex - Global Foundations',  // size=md (32x32)
  'e0a098ec9b154cfa334d6cba1abd1f86c5385de0': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0bc796fa2b27f3222c5fc792ac969646512f8be4': 'Spandex - Global Foundations',  // size=xxs (8x8)
  '03092bb217100a59cc9d1910d6de2d333dcbc9c3': 'Spandex - Global Foundations',  // size=xxs (8x8)
  'afd16bf3738023661cccc049c2a0fc4fd80d4a2b': 'Spandex - Global Foundations',  // size=xxs (8x8)
  'bb4ac21ad8993817c839a8da18f71110356d1ca6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8596014eea94837722e7d3b84f222013e2718148': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f3d65e27435a2d410f02d86bc2f7b3497f72fd70': 'Spandex - Global Foundations',  // size=md (32x32)
  '6627a9f43e60ebd21cfc41cfa6649189a1681427': 'Spandex - Global Foundations',  // size=lg (48x48)
  '228570b0a31ac369fcc87a895b8790a596507496': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd7cdd34a0b229cf61650c9b29d1e6201b8fe6f2a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '829d1ebe1c6ff7991147cddd8da3b9e6848fbdfa': 'Spandex - Global Foundations',  // size=md (32x32)
  'aa04f1ea3da334494c02200b8f5cd6f652df5e90': 'Spandex - Global Foundations',  // size=lg (48x48)
  'de2f031b1b0bb1b82fb23fa28e3835aa679b47ae': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a8f8b75322d6989619da93170167207d01df4c3b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '838522b5bea3cab5192888094a3f805ccfe1ef9d': 'Spandex - Global Foundations',  // size=md (32x32)
  '171539e11d467b6079cbe90a7558443b89e59d57': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c4c86d55a590a545fe309af5286a289506b91a86': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8972577874d94d9f2a2e671056494e7ff87c1969': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3e689f55a4b6b7525f7cefefa78d1f81bd6aba1f': 'Spandex - Global Foundations',  // size=md (32x32)
  'e7fd79b299b877ed0381a79e22d8eadcdcb26014': 'Spandex - Global Foundations',  // size=lg (48x48)
  'dd775103de32a4bc9a3c8cf59ab6b80ffcf81e3a': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ae2935904e38b942b355f83fd2758fa0eb20222e': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c26f6678f7f9f42104c42fa87ee3b496f727b705': 'Spandex - Global Foundations',  // size=md (32x32)
  'e87ce41212d61b25671666aa6700e1f92ee5270d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e3f99b563cb182cf1f4475c973e6f410457195ea': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b4c4e962575b10ed925a7db67ffc6284e1275056': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c74914a98f98cadea41790e49326a6667445f7f8': 'Spandex - Global Foundations',  // size=md (32x32)
  '915fde9e7616422974b44c557657bd4c7782d327': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7fc3bbd201bbecd2bd02ee017fc08798e26d3035': 'Spandex - Global Foundations',  // size=xs (16x16)
  '96fc2e1b1dc62c13303c50e1a9907f54359e7c62': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ddbf4bd0cb308ecf1107e7d9dee82f35b925f44e': 'Spandex - Global Foundations',  // size=md (32x32)
  '37da5b669f4f905168c2d79b06b2c6642859deff': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1e4fbf4ac4754f10cadc41a11de949212fdb169f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5b39181275b326f93fef34d5b88c851c95c2594f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3f33c0536a170fd835823f9dcb27ec6440d21420': 'Spandex - Global Foundations',  // size=md (32x32)
  '0a6c4aa47aaa1fec2f81369477a4e5c57a659afc': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5e63c41736ef8557cd944a835f90e193fe509c45': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9b210524818d8ca2f34ecba54b90550d53624da3': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a0fc98a6149f0a6b9566b211886254e0a4cd3145': 'Spandex - Global Foundations',  // size=md (32x32)
  'c068e5be554f48df923d761190ec075fdbab8b02': 'Spandex - Global Foundations',  // size=lg (48x48)
  '89ce4ae1012840b01d3a06ba10d47083bd2ad65f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a802bb6982ed01ecb496feb111ba71309da59faf': 'Spandex - Global Foundations',  // size=sm (24x24)
  '33a216c17f2bd14056927f088661c56d89512a5e': 'Spandex - Global Foundations',  // size=md (32x32)
  '7eaef5fda946c5d8c0905a28dd938842d0cc8d7d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'aa2821fb8123cab2b35a15fb794d309595e1ef8c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aa055aa33c1b3fb3624ed8a76be35b81b75b5c85': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3b6013f111864275497fd9396c3eaf1ab4282fe5': 'Spandex - Global Foundations',  // size=md (32x32)
  '9cd8efc8f0436226b85d6406cc95b43a112ea1fc': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ef74bfc11d0203749536924b797eee37bd8cfc68': 'Spandex - Global Foundations',  // size=xs (16x16)
  '07711ee6a47da6df32b72b7ff7cc7ba59a22d950': 'Spandex - Global Foundations',  // size=sm (24x24)
  '59a72767b9bfedf2fe681902d963969d1ac513bb': 'Spandex - Global Foundations',  // size=md (32x32)
  '96dbcd0e5dd00ec21c8383a2990e17b8a0357b0d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c925ab4ea89cd07e997070c8fe3063ffb58b41b1': 'Spandex - Global Foundations',  // size=xs (16x16)
  '780637fe342faf31e3ef40d568ef4e8d5d7f9324': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ca2f0176ed29f4da0fc6b139c6099558641d5657': 'Spandex - Global Foundations',  // size=md (32x32)
  'ea40ff88941661df859aec89fad47c507ce249f2': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b27660d6179505f9cf34e23792ef444d5e71949a': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bd4faed79e51d8520354def22df4f31e114a135c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2b5aba50f403c6f0229a8be5a4b1d1b3e229e821': 'Spandex - Global Foundations',  // size=md (32x32)
  '24ad1518396bd51f6956c8111b8152ba89e803a2': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8dde0aa5a5b61371122b8f7e3535bac597ef6d72': 'Spandex - Global Foundations',  // size=xs (16x16)
  '554b62f58a59ca89412f5266a52939ec584b01f0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7053d99552a200a65a341c7d6e51cb3e4f53367c': 'Spandex - Global Foundations',  // size=md (32x32)
  '413e4f9a2d48b017a701102ad8a5896143d04e34': 'Spandex - Global Foundations',  // size=lg (48x48)
  '36f7d89cc931a62fdb127570134d8f12a65457d1': 'Spandex - Global Foundations',  // size=xs (16x16)
  '25ec8d69245690371559dbcf870b4dd7154b6a31': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c64d6c0e50d0d74249b7b136773ffcf050be65bf': 'Spandex - Global Foundations',  // size=md (32x32)
  '61904a24cb9462e4ab8289b2895f6ed31ad08b9f': 'Spandex - Global Foundations',  // size=lg (48x48)
  'aeb83377dc5a589d5e7af0ee6454b46244acc77d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2fd95ef8c0d183329ab67ff738f0cb754f56dc45': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd240adb24fc5eebd60d14b2e421907758585ac22': 'Spandex - Global Foundations',  // size=md (32x32)
  '3c2b76c1df8b8c50bf3bbb7e20f585c4e5917852': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3db0d5f36fbcbef51988cbc6ecd793ee76a15216': 'Spandex - Global Foundations',  // size=3xs (8x8)
  'bd0e8acae8689ff633153169a491150c8236e85b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '20c7064717f370fcc64d8c912a473954c3c125d4': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ba1837859e6840b2d55f1aac378812081eb75655': 'Spandex - Global Foundations',  // size=md (32x32)
  'b33dfc8b650f1364a13e5fa676890c314b64145e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '059b46dc1653a114884e87afc350c6b49eb4ffa6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7abfe5496f1619a877300b8018472985fc7cbac5': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6fa2591114b3faad4ca505f691660a42a7e71ff4': 'Spandex - Global Foundations',  // size=md (32x32)
  '3be634606bbeeef5f6127858a4520ce9337be50b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e7b6bfcf82a942ba9a15eea1081768406fbf13db': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f3ec1d268eed231fabc94ae8459935a82f46af96': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6747eb119518c37bb9276e01ed629afe0dd13fea': 'Spandex - Global Foundations',  // size=md (32x32)
  '1355e32ee8fee73d451c11cd8f0b628c5b5d6086': 'Spandex - Global Foundations',  // size=lg (48x48)
  '097f093e06c355234541f2ac7467acfa960ba4b0': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c9bf7157bbf0ef6b78069e2138f6ecc9b1de1a0b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e9d30e04e8404d9004cf938ef8b8ffa3cb268093': 'Spandex - Global Foundations',  // size=md (32x32)
  '9b89d285b02ba0206fb31c3ff2be5b2431f85f27': 'Spandex - Global Foundations',  // size=lg (48x48)
  '46472d9e6143095735711cb3f146cca0e5cf1f60': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2a7115a63193d478d7a58dc17bbbae397e90b6d3': 'Spandex - Global Foundations',  // size=sm (24x24)
  '929038e8d33d6a5f7a3d91692f8609f1d0a7cde2': 'Spandex - Global Foundations',  // size=md (32x32)
  'cf2cbd65eb896456dab0c886a76d2186d6cc440c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '31e69470c02073589e14f7072bcffb97b70ae8c8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '24f4fdad333271db25c9d05fe0fb446697366a76': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c1493e18e48d5c837e163e5916af9bae9a0c413e': 'Spandex - Global Foundations',  // size=md (32x32)
  '9d39f7cd3374129dac7c6ab7e04b738ed379b7a3': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b71a2dbd054592f7bc409f12fb7220be6dc50a8c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4394d356b2ac1ce29d663844c2808417d8f5f767': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9135296c18d104cfd8709bbfeec3e2cf84c57a3c': 'Spandex - Global Foundations',  // size=md (32x32)
  '810a4fc167b8196ec578207f7463e8a0496146ba': 'Spandex - Global Foundations',  // size=lg (48x48)
  '024e7009b284acb8d557d077b5870a702d5b8d26': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4683a8ad138d0e76d6bddf279484bb370057cb61': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e4e0b7245c17694c864ed52e7f91401d42973118': 'Spandex - Global Foundations',  // size=md (32x32)
  '668cefa808fb3d68da9f4914a22e01da2898eb0b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ac1da05096a644d568d71a47aa641ea1cbd0e9ba': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9ed2802853232be8401ac400080fffbc1d4b3d3e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '524f4652f64e6e9e52826a17298930ca8b62294c': 'Spandex - Global Foundations',  // size=md (32x32)
  'ba658e927ed0691c93b0e94fbc3281df9f971176': 'Spandex - Global Foundations',  // size=lg (48x48)
  '465798b82ecbfad71bad71744f5e2ab749920ee0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1c3c79d567fb83a7258cd2e36b1b62482e3db127': 'Spandex - Global Foundations',  // size=sm (24x24)
  'fff964bd3197a8247805777985967308c1e61841': 'Spandex - Global Foundations',  // size=md (32x32)
  '346a57c8b7650bc28de3e783fe235e6fb94deda1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '76f046ddb6728f83f0c5739291baad7a6e830ae3': 'Spandex - Global Foundations',  // size=xs (16x16)
  '984b42cfeeb28cfa680e42cf2a958f3cebfabc89': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9782320232ed9f303cb5621f0d0dbbb3eeda63c8': 'Spandex - Global Foundations',  // size=md (32x32)
  'ca34c43a0fc7bba04dfc7724b3d2004db5599789': 'Spandex - Global Foundations',  // size=lg (48x48)
  '24d6e81946030ce11070fa0a8ad21daa1db9b3fa': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c619ca27ff04f81b383f35b7319c064a471ca976': 'Spandex - Global Foundations',  // size=sm (24x24)
  '70fddafb18d9f1af77d958cf7d75a10d5f78c940': 'Spandex - Global Foundations',  // size=md (32x32)
  'b4e189cedebb2cf3deb763785230582f55065468': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0ea2e4cb38314e98499af16b4f26bf391751e947': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4628b05c457d48af9ea0ada92986e9b21534ed4e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3594cf8ae98b881cb7ac31c84c23eab6a2524210': 'Spandex - Global Foundations',  // size=md (32x32)
  '6a3b2186a38fb327664b2bc194f5123f2b1e13fc': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1a9145f417875a57e6b09472251a0961aa36b065': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c510742c786905959f187713b8a5278bd1b43370': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ef1968d2b652f35a7b41b765aecbf0589f81dd04': 'Spandex - Global Foundations',  // size=md (32x32)
  'cc0bf3e3aad5355baa4f34681d65bfefbd83e980': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f456c3172b16b4dc8f9634d8715db2cc845166e5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4793fe3a4f3387c4c92e2dc0096b91410b2b907f': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f9ead166675000bea2a7ef5bb0323c7b009132f3': 'Spandex - Global Foundations',  // size=md (32x32)
  '5e13737c2f609253680e54f1b0110728470ff327': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4d22cdd05bcf78903863c1c4a9eb2bf24c2873aa': 'Spandex - Global Foundations',  // size=xs (16x16)
  '536c71733be64dd4711131817cf0b5ec3ca69f21': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cfd09c4fae186e32be8b9b760df0433707a59324': 'Spandex - Global Foundations',  // size=md (32x32)
  'd694a4d7148d054c716de898cbde6d0636dbe697': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1dcfbc6a30b5a384e48ada10a37211457015c076': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2922913d3144cb92ef3627bee6173a103af38ff0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6e9070bb6738ed306a4da0bb292186916f67b63f': 'Spandex - Global Foundations',  // size=md (32x32)
  '9bd50b8fbe8ceb9d3a823c5a1091be6036a02220': 'Spandex - Global Foundations',  // size=lg (48x48)
  '73d00b7585ca55fa23ec4b9f5161703e655595a7': 'Spandex - Global Foundations',  // size=xs (16x16)
  '32429bcf5cf557ea50ae6df295cb827ccbc939f9': 'Spandex - Global Foundations',  // size=sm (24x24)
  'bd94f84e5738e84ad9312c901a9609638cab555d': 'Spandex - Global Foundations',  // size=md (32x32)
  'b744cf10627926f8cfd699bc0e34c6461320457a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2d8bc91d5639148024e5d1fc099b9716624342fd': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1fa2154479c2e2b1d545c56da60ec73a2c832b4f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '99c0be9311c20839473c8e911fb051782fd3a639': 'Spandex - Global Foundations',  // size=md (32x32)
  '38613141b98a012e2c6cbb483f8627e6ad313da5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4623da132b0e61d012473510db072fbd470d30ca': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0ba935cfe4a0b85a525715223643684c842f6f8b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e4914ab9b403bb1623f632d57485f8413e820d14': 'Spandex - Global Foundations',  // size=md (32x32)
  'f40492eecdf7e75a3059ea3c178e7846c3426ade': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a9f245b2e3976f125a4dc27ca14c8511abcbe16b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ad3fb90d5a601e5f36bf94853ac038c4c14c0d93': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1e3a1cbac2ce508c76706535fa409847fcf4d06e': 'Spandex - Global Foundations',  // size=md (32x32)
  '4aa3ba5d63c2be541f9af6c9f95655a1de205936': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a1c72bfef6e023f6ab35c87b237f769d163abfea': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6baec6683ccb336eede6fe883c4e45763356ef52': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c7a38b3cfc04516ec3f484e0c57ff35dee40ddca': 'Spandex - Global Foundations',  // size=md (32x32)
  '4701c040c57b5fa3ce6d6bb3e99c09f893490c90': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c2e983581a2e6219c601f0d4f8880051f0c21cee': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e735b99b5e9bbac4711ea5817466eda135f187e0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8f0e34e299ac69dd3429013baad474a9f6ab787b': 'Spandex - Global Foundations',  // size=md (32x32)
  '1063cab6b6b492a6aa86dc282911cb97cf48d9af': 'Spandex - Global Foundations',  // size=lg (48x48)
  '06e3c623e14644aed8bf928ad98e02af47764b0d': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd06801de4bc412ccf5b75cd06e4aa634a5cc6790': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a489391ce211986582c77a55b7c3d4c372bf5caf': 'Spandex - Global Foundations',  // size=md (32x32)
  'f74e8f599516fcf5b7b93c678f9f164e9fb4c56f': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c58022bede404c63594b5087ea6035073f78b7c1': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a2de3771020197a62b988fdf22a1f0c2a2165497': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a07c723794055c4ec8cf3bdf064dabb81d443803': 'Spandex - Global Foundations',  // size=md (32x32)
  'a98cb5a4839a3998c33fe8e9c83ea0e70490e79f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '27318c2620daed79c7c0ec2ba4188eccffc41a72': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aecbe861c7a9882370e702f84fef448bd4e10865': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3eeb2d5c60ea3fb6b7c94ef0135dc5185cf66ba5': 'Spandex - Global Foundations',  // size=md (32x32)
  'bf76b101217120cad01dbf797455c399bb29253c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9e62f183a1dcca76a5849501cc431e3181dc4df8': 'Spandex - Global Foundations',  // logos / butttonAuth_Logos / facebook
  '3df54dbed5a46197c920174c95d35dd91be88cb4': 'Spandex - Global Foundations',  // logos / butttonAuth_Logos / google
  '6a02efee4a035b83d7f3f7635e667221ced78a16': 'Spandex - Global Foundations',  // isDarkMode=false
  'af0ccd928441f8fbcfe13c9104262f7790adddad': 'Spandex - Global Foundations',  // isDarkMode=true
  '6b3813c239626fce83528b439c9384b820cea82d': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fdf9ae7d3b35645fc3442aa4a71d4bd6d4401368': 'Spandex - Global Foundations',  // size=xs (16x16)
  '65a72c92a7227a5a44175d0992e06dd7d9ac0a6f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e4f65f48f4b4a2f23cc589b23ee855d41ca9b8bd': 'Spandex - Global Foundations',  // size=sm (24x24)
  '220bb0f4e6dd08b2f4fa5085eb6a475817767af3': 'Spandex - Global Foundations',  // size=4xs (6x6)
  'ac54c4f0f6f7aa489bd9037dfc284754c124f4bb': 'Spandex - Global Foundations',  // size=3xs (8x8)
  '97017deb88596f8b73390680a4a6330e7d830830': 'Spandex - Global Foundations',  // size=2xs (12x12)
  '02b99d847854832721fbca03a3f0f072e80cb293': 'Spandex - Global Foundations',  // size=xs (16x16)
  '136efa334a95c497f8c5866cc723b19596eba770': 'Spandex - Global Foundations',  // size=sm (24x24)
  '95068e9d8a202128581535444c459314edae19cb': 'Spandex - Global Foundations',  // size=md (32x32)
  '3607a0f371698cbab139463188ded07f8645ac5d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '44f6172116217c462581759ac3640c3df19312f1': 'Spandex - Global Foundations',  // size=xs (16x16)
  '060c944199c7429e142b14c50d7ed14b2bd89f48': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd2d22f7a233b6912a026903ba8bfdb1669b45e99': 'Spandex - Global Foundations',  // size=md (32x32)
  'e09cc75944a1d28e19b1b81cf14469ba5807e1ee': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd101d137b298acea76e23ed73ff8c1eedcd7371f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f2d69b9175986abacf97f0c9d881b35531a70213': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9ca6587ab30b69bccf582f69c46ac7757927a911': 'Spandex - Global Foundations',  // size=md (32x32)
  '31fa8b63fa09125f6085d4e85bb39cdcf221c9f8': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a12a0a3beb6fc0055a6bb8bb4c5854c65a880d70': 'Spandex - Global Foundations',  // size=xs (16x16)
  '97c6e7fcf7b1dd1b883e8e3877e21161a25e2abe': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e2f5a68e666ea868c08ed3b7c0dea16313ce5bcc': 'Spandex - Global Foundations',  // size=md (32x32)
  '3b3c913668d3d4b368da3e929a879dde1e5c160b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f9dda5e02becfcbf4a5ed67a0b5d3eaf55e772a8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9575e634babe840ed5a2c38e424a513b5cebdbc8': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a3ec0b66c37abe2a5794e8b1e7f9a7b5e7389e1b': 'Spandex - Global Foundations',  // size=md (32x32)
  'b5abc81dbd945c5e4c8b1694fbd892e7bb37eee7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '64ea1bd4ea6750c3694c900e681ef99831f34ec1': 'Spandex - Global Foundations',  // size=xs (16x16)
  'adf9bc1015ab6c4bba9d7c6899063fc445f00d7a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7e451a4d9dced9535bffbb3d7c1de451b60d149c': 'Spandex - Global Foundations',  // size=md (32x32)
  '704ba47e4ec62a55847a79cc9a820b0f8699bbce': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8d29aff78db2e8c8127ee0d58f631a804d85e051': 'Spandex - Global Foundations',  // size=xs (16x16)
  '570953eeb6727612e9706b2a66e06a016308ae09': 'Spandex - Global Foundations',  // size=sm (24x24)
  '16cb149258fb86b2c5ef22cbadd45642913889b7': 'Spandex - Global Foundations',  // size=md (32x32)
  'ebca595339b33a2494126c416ddef685f0844275': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1eaaab41229728279fcc3e65b8142cd50a7b1326': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7bb3b827f950d1f6166f20cca2f7fadbbba7b0fd': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2d59fdf16875ed4065b7c78c77e9d42ebf944c75': 'Spandex - Global Foundations',  // size=md (32x32)
  'ede8b1869697649871b93943660f62154e8c755a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6801f891b7d26e2ec795754e19593b283a6bd51e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '250e7648ded81733edb86bb6e0d3050e539cfc12': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5ee9289739c8240bfbd9088a217e084297c90803': 'Spandex - Global Foundations',  // size=md (32x32)
  '880b965941a2fc165e2433e1837041d3007d9bda': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3309dce76e6e0397244cac6ae85b747a05856726': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ab8c15d4a43e3a4eea3d327c059ee4e45e359a95': 'Spandex - Global Foundations',  // size=sm (24x24)
  '67fce0834829fcae7a6960fe3c57a6e3e9ed8320': 'Spandex - Global Foundations',  // size=md (32x32)
  '0896e462dca443448039cb5738e95981b1d7fec5': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b37296b5d7494736acb157cb0b033fe4e81fc7c9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '92ea8f275ccff5b6f71551a916e2c33361e1e119': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a516efd9be5903325bd3a1f873012e0bcb0f9082': 'Spandex - Global Foundations',  // size=md (32x32)
  '4ccc47af0ec52cc2c8e8aa9d6a1fcddd51aeb663': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5dcd0888a6933105f5251e40a3be08c746ad9d1f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2d8117cb1618580b6a97fe4581b3fb0275aea1c9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '127e0c08f0a026af17fd4fea2dc94c61222bcce1': 'Spandex - Global Foundations',  // size=md (32x32)
  'dfb957e7c403281b0ed967d770c8d999c47d8bd0': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ddb1b6175ec5a4af797796746fc90d0761f42e04': 'Spandex - Global Foundations',  // size=xs (16x16)
  'eefc598744e14caa8828f739e4b5d9af11cb905b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6723833eb2c354f785332944de8d50e713342fd9': 'Spandex - Global Foundations',  // size=md (32x32)
  '791cbfbc440b882da85e83c9ae2e0bf1b0740516': 'Spandex - Global Foundations',  // size=lg (48x48)
  '75d995f072cffbcca1b418f91fa1c3dac2a31955': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a5b30e3e49f39d199803ce4f39cc3926789f0c70': 'Spandex - Global Foundations',  // size=sm (24x24)
  'aedd8a7e78f2330a4899aaab898596c70cb894ab': 'Spandex - Global Foundations',  // size=md (32x32)
  'f5485655d9014d6d19c59323715b99c95fe3b32f': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f18b048c2f9aa0af28323e7ecae67b1289dd2517': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a58d0e7b19ad9a2f8f645529f9a6a14b7a82149b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '15523f470fe0a6c9ec7298db12773dfb05a4d608': 'Spandex - Global Foundations',  // size=md (32x32)
  '1230f704856c5072de338a5b1d0f6376177717b3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9f05b1e715415b9ed7a42c7bf4901d4e6278adf1': 'Spandex - Global Foundations',  // size=xs (16x16)
  'dca139e866e350de2fae2ad3af433e6968e4381f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2e1dd42a32bdb5e8420f1b85006c7b1c1100cd87': 'Spandex - Global Foundations',  // size=md (32x32)
  'c15c116ab94df2ea6144fa56e9ce3c94575da17a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c9cabad620a8207a5b654155f10b602f280d7f24': 'Spandex - Global Foundations',  // size=xs (16x16)
  '809ed2c1e8b18f82deaa5cd9f35dfe7db2145f3f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1ba0a83d4c9b815487b50c90c10e9a397a3bd696': 'Spandex - Global Foundations',  // size=md (32x32)
  '3e4dd4ebfa1bbd5d20320268e8377923b8440b17': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2563b736365f1e5602a6d6578938006d5d3165d0': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aa0da47133ec792a3ceff454701e3e41fc89ea53': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ca1f607d8bb852a03edf48e626589bb370584eab': 'Spandex - Global Foundations',  // size=md (32x32)
  'd56705337d65a56c96e1e597557709afbd571004': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a84fb350e06be46a45ff9f72533e141f0795fb92': 'Spandex - Global Foundations',  // size=tiny (12x12)
  'b1137ff56cfb605b0766916ac5b70c37ce986e15': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd66a4dca24f864d6bc811455ffde448b1d341709': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8627fb8e5f792709503656e3fdde0d92459a5b55': 'Spandex - Global Foundations',  // size=md (32x32)
  '42e0dc793c697d94d18f0b1641bd3c8e3cd5f455': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd4f01ca96a2b833d4a09ad89ec239c34318ad38f': 'Spandex - Global Foundations',  // size=tiny (12x12)
  '2e9b2a6f020d52fb1bbcc7461df5b35b13f3c0a7': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd881dcd794012761b2b8a900558b7063a446b279': 'Spandex - Global Foundations',  // size=sm (24x24)
  'fc3ae79aded470afce2f86edd1673e53a301dd21': 'Spandex - Global Foundations',  // size=md (32x32)
  'a2330fecc3c808436609e13d12a8eb49089b0b2e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0c6fc8e80452ceb3f1684c5206eeacc2f4323227': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8faf9184b414f9dd406b32e777e5c6e880497751': 'Spandex - Global Foundations',  // size=sm (24x24)
  '550688807af92727c87f1ff66066c601d46fc130': 'Spandex - Global Foundations',  // size=md (32x32)
  '0fb9a8af87ca5b09d2eff46edc34e01ec231859f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4baad7d9aac123d9a61eff443f9567c6e24e5cc5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '73570a14c7fd2b8d3b05d49d95197cdf93764c68': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b84d6685e7fb37f8267e6fff4916cc435f93f710': 'Spandex - Global Foundations',  // size=md (32x32)
  '82da718a0d3983f6a787ebe4e31b067d7f2a525c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5886877a138d6c6153bb57c15e7df24d1a3093ba': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e1885f7f32ed6eb91c620678e594172c1e1c91cf': 'Spandex - Global Foundations',  // size=sm (24x24)
  '12d58322457a0c4abfa2d82433cef51973d9f296': 'Spandex - Global Foundations',  // size=md (32x32)
  '786ba17d52ccde0889bc076793dbc6800e1714eb': 'Spandex - Global Foundations',  // size=lg (48x48)
  '97e40d7fab66831ef0ea93cef39b8ceab236b020': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0d6414b685ebb024c93efe7d2713c04acf692724': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4c0674de23d595c78773d8518971adbaf7b26c34': 'Spandex - Global Foundations',  // size=md (32x32)
  'bb4d25b904363bd08dae522977789f8843d59cc5': 'Spandex - Global Foundations',  // size=lg (48x48)
  'db3cc2a15a2330624bfdac105a94f95f16d266b2': 'Spandex - Global Foundations',  // size=xs (16x16)
  '124d170e1664c7f62bb91665dd03d72484c31ba5': 'Spandex - Global Foundations',  // size=sm (24x24)
  '905d5b23336e07bcc471038b334e2244465f2fd1': 'Spandex - Global Foundations',  // size=md (32x32)
  '818568e4d6f196455dc50d970e01d5bb28e07368': 'Spandex - Global Foundations',  // size=lg (48x48)
  '32171afa2a30ee2f2756356ee52ec989a2706e7e': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a3fa6d16c1b733e9dd0f8fb2998d902bbf496fa0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6451fbc01718e825e6209b9cb4d48b68f9af536e': 'Spandex - Global Foundations',  // size=md (32x32)
  '2c4b1840ee1c5d0cec3a15ead9224f8b0be40348': 'Spandex - Global Foundations',  // size=lg (48x48)
  '133e4c386ceb96bf36dcdacdafb3e6d7cfcd864c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fa1062a06bb603ff24e913d8c461a5c69e1d2bf3': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b8a814e3d5467d99b41842f75ac89734040665a3': 'Spandex - Global Foundations',  // size=md (32x32)
  '023987605760d67ea8c66d15f42f0515e34dcf32': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9bb8dbb81d6f65d270c37c3012422cee21e9fe2e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8659d72a7916c1efc4e2d76677852ac057df6309': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b986004d055ff74fa2a991aa2e561e3dc40a2e94': 'Spandex - Global Foundations',  // size=md (32x32)
  'badc42cf51ecc7bdb095f9d48675fa298952c81a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3a35567b273cf805ed3e07b936c0eb6ab170cb91': 'Spandex - Global Foundations',  // size=xs (16x16)
  '702a93b8e37a9626cd02ef66956c775c1591b521': 'Spandex - Global Foundations',  // size=sm (24x24)
  'fd186e6e2ea8fc8210cda98336ecaab44adcf046': 'Spandex - Global Foundations',  // size=md (32x32)
  '6991052e3aba5afc0628f50dc25b62c15e4dcf1c': 'Spandex - Global Foundations',  // size=lg (48x48)
  'fdf45d340af8d1f821c48fce654de8fbfd5d627b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ca23679d925603127d4ace9d6b53ac96b9b11a4a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '56f07e5e506eb4f38d2b63d54fded8665f06b1b4': 'Spandex - Global Foundations',  // size=md (32x32)
  'd582fcb1f0dccf97bb48978a4164ae8a931424a7': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd0dfb0aa88759f09ef3f1da186868e1646d7e0c5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '117f678dc63c7439a1f9bb0824b250eb62d1f81a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8eae76912a44c750afdc6cc93b56a9a30262c37f': 'Spandex - Global Foundations',  // size=md (32x32)
  '52507ad00ce17667c1a49ccdbc31be2a765ec5cd': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1ab6cd74ca24a4fe5933c071b1327f46d9ed84e0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8535a5d0e4c55a953cf201fcdf338ac02a4305fe': 'Spandex - Global Foundations',  // size=sm (24x24)
  '635d08d47c5fd8f20f9c63d24a9ad1032e5cd7dd': 'Spandex - Global Foundations',  // size=md (32x32)
  '713bfce29059f7e9be369d356d855c2be776073e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2c8ac1bc9036c576528524f2c64a873a9c1b9f93': 'Spandex - Global Foundations',  // size=xs (16x16)
  '98e1fca9ad2ba66f0143431af7cf04f7ece81502': 'Spandex - Global Foundations',  // size=sm (24x24)
  '836419abcb03e80a78760e1f02607926e58134ba': 'Spandex - Global Foundations',  // size=md (32x32)
  '63127e975b1a9f78b570fdb21e55a15ed2c01ed3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2f5bef9e13fb4329430f15e518fe15d1975020b5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '796567a7b56874a6b39929a661fe0370e72081ef': 'Spandex - Global Foundations',  // size=sm (24x24)
  '28119f23e636ca747ad86d531c2dfa66fca152ef': 'Spandex - Global Foundations',  // size=md (32x32)
  '0cdca76a5ffc3f13f5db8eb958b29c62f462f8e0': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ad22cddcbc298bed4cdf68802ff0c49a7bdbc3d9': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ad91113161828df6164e5b790a04c2151f592801': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e837fe6ac3b8fe86a274ad2cbf33671a4ead28cf': 'Spandex - Global Foundations',  // size=md (32x32)
  '3cc3f8ae518f32de2260477dafdc8cb5be2c1491': 'Spandex - Global Foundations',  // size=lg (48x48)
  '481084c9e91ab21787b5ccc834a08745ef72e881': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a40635b2d3945f30df539b5cc400268cf69b0aed': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9b5be2eb3c9348004696162df7f954eff3a5b123': 'Spandex - Global Foundations',  // size=md (32x32)
  '518713e6d1c90ef89b0e899f55247947f76a3228': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a9f3fe64fb0121a2248b83867811e2c05c075baf': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bbeb9a0f0acb9c71914ba6c534253e1d93202dee': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a7ff8c859cd9e42314ba4b343ca997d1dfbb4985': 'Spandex - Global Foundations',  // size=md (32x32)
  '0d502c327514915834afea8c987296c5baccb5cb': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e46ec82c6ffd28ba77569dece37069ae0e2b1972': 'Spandex - Global Foundations',  // size=xs (16x16)
  '77cb54b4b0249d5a2112c91e69aeb7b22f3eced4': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8059e1282d99077fadc19d8c022cbabc36f38fbf': 'Spandex - Global Foundations',  // size=md (32x32)
  '91d46ff668dfe63213fd2b215d23ee8ef1b9bf12': 'Spandex - Global Foundations',  // size=lg (48x48)
  '406b7a3741892bdb4fa2eda635200f5009e8ba74': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e71d31102df7bf1305e3f8612f6955922f2f56ec': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7e076bec722347debc59485091371cd821f921be': 'Spandex - Global Foundations',  // size=md (32x32)
  'e474b09c8e68f49d13ee549ed4475fc7cced7918': 'Spandex - Global Foundations',  // size=lg (48x48)
  '241b2c2957b4a7a178c33558efbb78e2047c95a1': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a8c6772e66b367ae5d44ab484c7b64f6c8c70562': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8e76bbdf9c9fe832cb97bf1dbd44451165f3f645': 'Spandex - Global Foundations',  // size=md (32x32)
  'd7b996a6906020caa1b75392ef8920f10a83d7e7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '079d62961bbef6da4feb9c69c1e162ac4f73fd1c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '677460d649a0ef5d746706bb802baab817b6d858': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c0db64082003f6fb06c43391cb828f92e8ba7db2': 'Spandex - Global Foundations',  // size=md (32x32)
  '68a49c021a27a7ca706ed0976b234e1eb2ac9c02': 'Spandex - Global Foundations',  // size=lg (48x48)
  '12832cb1df879ef5da83bb82c999c315f1d37870': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2b0d896e6652d02f6283664a952ff9cc7d1913e9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9aaddc53f31ac734c4f04f4fa2ff8f2851586435': 'Spandex - Global Foundations',  // size=md (32x32)
  'b0b11987a43b68154de6936e64535bafa8bc0a5c': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b2116529441e992b3c214154295594ecc854fec0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9f6f6fd9fc97f0607854bc697c3bca3dc866b856': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e3786bfc2db6eb0b6308002dbb0c0044d9fa91c5': 'Spandex - Global Foundations',  // size=md (32x32)
  '3004e0f5b0da995244531b62d78bb57fc3501543': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3c394cd9ea170c551900bf495c36d88bd1672c6b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aa2ec27cf1197aebcfd115e1e0125f888b1b3228': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b1a795b56cba8ca2c97aaba73f985db857464e7c': 'Spandex - Global Foundations',  // size=md (32x32)
  'cfc1d2994f29c5d60b2f14aa3598cada550c535e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6da13f162f36b4eb69eb1cda0ca3f8542d95bfba': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0b06b933b94f25c53c52ce5b16b2a4cfef271a60': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e72d62fe9f7f549b9885ebaa1ccb611c4248df2b': 'Spandex - Global Foundations',  // size=md (32x32)
  '4e8673902f541712e8ba83edbfa657a216f75c8d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'fbca4d171c67561c49a3cf56579bdc62ec13ba33': 'Spandex - Global Foundations',  // size=xs (16x16)
  'db3058e17e1b8ca08f0ceea5761341733810294b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '98dfe6df0d6b1427097b9bb7c2086aa0a51b97b3': 'Spandex - Global Foundations',  // size=md (32x32)
  '71776fcbf8e7124046390a8db4a269a65ba96ae1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '12a7e449848d4b39c8940c6ebb7d366e05b450e7': 'Spandex - Global Foundations',  // size=xs (16x16)
  '091af62e4bffa64025c9fdeaa6b41dfa549a9efe': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8173d8e362b8dffe161938269920631c9206d8ed': 'Spandex - Global Foundations',  // size=md (32x32)
  '8d704720de1360a5e9adf806ca5370248b1d7481': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c1d5ff1a92344381115593d39596689f7adbee2f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '729abf889d2c736027bff12e626ed9def5d55c4f': 'Spandex - Global Foundations',  // size=sm (24x24)
  'df1c86a46a4c46735583a0cdb342ae0416d70ad5': 'Spandex - Global Foundations',  // size=md (32x32)
  'ca18bffab560266ee33f4e48d057f25499975d0c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8bf84aad4e90fec2b5f45a09d64fdcd349ab8118': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9df0069b247194769b671fc28a5b6ee992a70a6b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '078354896bbe553d4d02a418fde470d96215c227': 'Spandex - Global Foundations',  // size=md (32x32)
  'ba0262243d8ac329593c86533037f5f8a66f676d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '79744e3649d5c3bef4a61a8e26a109281a48570e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '11b6fdb61dae175061d59b8d83344a717e719314': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a535ea27815530e236636d7e7b6f8950bb601031': 'Spandex - Global Foundations',  // size=md (32x32)
  'b2095a9a0bb3fed934d5fc82c17ed618ff8e2f63': 'Spandex - Global Foundations',  // size=lg (48x48)
  '025791d6b3cfe44bfb79c8116558e702a784e727': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fed308042782fd68344105c44e3eeef6cda77f99': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b84f784becd7345c1ad66432c8c47352fd64d96a': 'Spandex - Global Foundations',  // size=md (32x32)
  '99258b4fde453a94f69e9d3d7774eec579ec9f7b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e58b5255c34b16533e5d45e9c98df64def6add7f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '790aeacc29bdfa76e4c930998adb0f2c27b3f4dd': 'Spandex - Global Foundations',  // size=sm (24x24)
  '36f82cc18c915068adb79e78c1f62da1279e2e69': 'Spandex - Global Foundations',  // size=md (32x32)
  'ca6bd630b4cc19fedb8a29570e5c04bd6dd381e1': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e9df0d97fedc03349cbe7ea1f538a2bf20b37fd4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '89ea28eaca114e9e95d256b9282785bd8c421368': 'Spandex - Global Foundations',  // size=sm (24x24)
  '499eea0f4d8e2e47cce358f5515e809ad8b1a1a3': 'Spandex - Global Foundations',  // size=md (32x32)
  '0f7b2c75c7b90ef534007375eeffa49d17dfea66': 'Spandex - Global Foundations',  // size=lg (48x48)
  'de9a4f53d8b34a0b244f299f4e92d22853a35b56': 'Spandex - Global Foundations',  // size=xs (16x16)
  'db8208f278f0275461c3eb8aa412fd3825d0c9b2': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b680e29b8893d8807a7ef5239b6c75fd86e499cf': 'Spandex - Global Foundations',  // size=md (32x32)
  'df32be766545bfd76fbd6552f9674cfe7d467095': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b77ecccd222132609231b77cb0dce5527336fb1b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bd8664730060f507ebf4b4241b31c51e469706e5': 'Spandex - Global Foundations',  // size=sm (24x24)
  '96defdcca37bd00725b592c462ef4b580f491532': 'Spandex - Global Foundations',  // size=md (32x32)
  'f5f85f10720d2edf120a81ae257acf3f44b1029c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '12b649aaab0dd8ecadc3d0e479094967542357f2': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b5f64142df39a04c9e8ac065b8bcb74630cbd660': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a807f3a4d9d254ce4d3640aa0fe7af4b821929ae': 'Spandex - Global Foundations',  // size=md (32x32)
  '7d370206b8575a029cb5fc2b1b8f27a3ad6a5c8a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '02c38c287018ff0f12b63f9ae7d9a3d5282d16e5': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bcfafd4b54391c44b729f17b0506d14026eac90e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5ed914aa294da94f2e3093176a32f7df37b75e71': 'Spandex - Global Foundations',  // size=md (32x32)
  'cd50d9a6852d6b9fd6e31bd3a52ee72a0ff1b500': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0fdbb813c18a70e90c289666ae96c2bc67cd9320': 'Spandex - Global Foundations',  // size=xs (16x16)
  '10d8bd30256caa7371ba6bb43c8d80d287d63cb3': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8b08d858d1ba4a832477279b28dbd93d2d5d80dd': 'Spandex - Global Foundations',  // size=md (32x32)
  '84002b035b225c9b706b80de3ae7d926263d2b82': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4d9bcf491a6b9a586a5064b503d2cea4f3f0973f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b0125af3eecca90f13c9dd1e153694c6990e0fbc': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b08f90393be8e69a4c90b3a1d4daa88adafceb2a': 'Spandex - Global Foundations',  // size=md (32x32)
  '2aba58fed5725bc375e65803926c7639e4f46a11': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b873925e9f459c43e622f1ce1783dfa208fabfee': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4634d30fb2d3757c15e59a39c75036635a83ff44': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4b858d0a988a2bb54eedda165c17a4c6b6ae7d74': 'Spandex - Global Foundations',  // size=md (32x32)
  '3bcf807b2532a8883fe3ae64a1098f7a0d6ee7c7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '540d73c2b87ab5ff44a4e74f522d674001c2d15f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2ae10956dbd758a6fc2958f46550f12b76a5a2fa': 'Spandex - Global Foundations',  // size=sm (24x24)
  '95cb04ed77b0010aa1c6c840207f25c80bf17edd': 'Spandex - Global Foundations',  // size=md (32x32)
  '03862fafac2e314d05e56e2898e809d9a44e6a2f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '55194eef5da6a117e81d797fb43ed0a3f6c77cf5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '676983f251f0bed0bc872ec28cc33a9b3b4a3b88': 'Spandex - Global Foundations',  // size=sm (24x24)
  'bdc5e1a516df2b39af7ee6a6e51e4da5a9b424ca': 'Spandex - Global Foundations',  // size=md (32x32)
  '0f6ec0cb128084458a0308263637df76fac927cd': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b55508d9629a135d3ebfd993dd598ec3eacf9d4e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '199c36c2982b24df875368b69db8d46279950b84': 'Spandex - Global Foundations',  // size=sm (24x24)
  '229f1a47c9c21416daf610d1132d2da0ecf930f9': 'Spandex - Global Foundations',  // size=md (32x32)
  '8ed7e714745c85c7bc031aca185663dccf94941f': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b10cf497a81d12da9792122950de8b28a299922d': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a619c0bcf43ef47d4536da562002d2d2484fa97b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6dea97089a60a62de4d04734126ca9f23edece7f': 'Spandex - Global Foundations',  // size=md (32x32)
  '665bb4a2cf1b7098092e5183c2fcab668642b308': 'Spandex - Global Foundations',  // size=lg (48x48)
  'aa50c7f267231cb04e158c9a62e4f9743facd5ba': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3d78db81e3e198b264de7a0589cd105c402f6593': 'Spandex - Global Foundations',  // size=sm (24x24)
  'afdb143d4dabe14bd573bbedd6f4d7f3a7c65f01': 'Spandex - Global Foundations',  // size=md (32x32)
  'd61debeb22e14721b75bb36e86a93d4aca5f7b61': 'Spandex - Global Foundations',  // size=lg (48x48)
  '23119c77600a23e81e026882ff76c323086c840f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '532a2a6c4cd36aeb9edd84ad898a3c2954e50756': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7eec4732edee5e4dfda6deec874ea68b30ee71cb': 'Spandex - Global Foundations',  // size=md (32x32)
  'd048788b82958ecd185a1cb9a25be3882cd5266d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a651b3b7b8ddbc3858b5a78418cd633b531cc125': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f6dca8cd2091ed4f9c427553ac1056055940059d': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd3e6e5f7b654035078d0a5cd7103d6a64b128ffd': 'Spandex - Global Foundations',  // size=md (32x32)
  'd2745483b2e6963cd5a312406131c3bd5f1bf604': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cb12ab20dee34858d2b1271ac56159bcbd4960fc': 'Spandex - Global Foundations',  // size=xs (16x16)
  '23251950a4074d7f68c3910cb4549ad1747f98e7': 'Spandex - Global Foundations',  // size=sm (24x24)
  '12ecdf2ea5023b870c1351fd261af70fcbc7288e': 'Spandex - Global Foundations',  // size=md (32x32)
  '1b5e7c074951c187719eeb470c55b1afbdac9aab': 'Spandex - Global Foundations',  // size=lg (48x48)
  '06a3b4382ce66d8c4a426caf605131bf44ac6a6e': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a782e0370a68bd09c7f67b60f7c801145098f881': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e13d3a770d5d9b958547edb2920ec61f0136ddf7': 'Spandex - Global Foundations',  // size=md (32x32)
  '12292168433cf92beba66a3d1196a6b9d4ffe6a5': 'Spandex - Global Foundations',  // size=lg (48x48)
  'be82233a0ac3e46c30e9fe89fce07ddd5c9cd5eb': 'Spandex - Global Foundations',  // size=xs (16x16)
  '87de5f2631a4e6be8fccfb72428f7ba3ea3e8884': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e7b082dda116aabd15267d5444eef5221e34dbe8': 'Spandex - Global Foundations',  // size=md (32x32)
  '1b6d086f04dff9f0fa8b5bd731b228714651676a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b2ccf1eb9860ad08d83779ffad6dd8ba0c11cecf': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2851817f3bf264721130ef52c402657bfd3df117': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a2e5ec8716ce2540a2fb0c4e8daaeb2564b5955a': 'Spandex - Global Foundations',  // size=md (32x32)
  '49c432c6abd8b100a2b2a0377a6bc76167a99d7d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5612ac4600938a4a30d09697006f5552d762518f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f571b055423a8ecd1ee53080ba5f9167f719a020': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a625026c5c6bf37d0af2f3d12d77bee7cdafd0a2': 'Spandex - Global Foundations',  // size=md (32x32)
  '7aaa1a3c252fb3ea81ccf9596912110906a7163c': 'Spandex - Global Foundations',  // size=lg (48x48)
  'fbbebbf9bf4be94006137523d6fb8805dc428d97': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2defa6b42beb90513c1a8b9f49c7bfed6b3d5f0c': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f2b64383028bd9f87b9abc86d6815684fcbe9141': 'Spandex - Global Foundations',  // size=md (32x32)
  'e2e8f104a635014b389b9f03eb2f0d9a9e039f06': 'Spandex - Global Foundations',  // size=lg (48x48)
  '527ca5d77c855e51890b3c9cc725144d3b9e16ed': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2e02b737031a5193be8d3bb6ce82b02dd80ed203': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6a5fbc35dfc2de9e4979b63c3532fa53c65e50dc': 'Spandex - Global Foundations',  // size=md (32x32)
  'f995794d9facd5ce77656df4b61808e42c681c15': 'Spandex - Global Foundations',  // size=lg (48x48)
  '94d2e17a162090843e92e5bddcd21c78e73c3a5e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '80b57f9fbb902740753b8a7ed091f754a0df0ab8': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a8e948f1ee099ef10aca8a7b315245bc3ccf1af5': 'Spandex - Global Foundations',  // size=md (32x32)
  '8b4c8bb96e67c8078b544645ab4e8b5122748154': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd01d1311c6080a04f1b2f2589f4cfba62c9988c7': 'Spandex - Global Foundations',  // size=xs (16x16)
  '26706cbad7050931fc61d6a666be447748498ba9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '675907ccefe228ebfa511cac52dbd3325bbe79d3': 'Spandex - Global Foundations',  // size=md (32x32)
  'ec3115d46f1e8d0345d4b1a45cb4b1a3483a8b92': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7a214b48c2a7564bbaae1f1a0ac51a4fbe050b0a': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4ff8c24837f0cd6e4bef23f25a2b38bf59a987d0': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a590a3628655fb77eb634e5607543877c4d52942': 'Spandex - Global Foundations',  // size=md (32x32)
  '77a964f2a6bbf8698f559e97d83b7340606e9428': 'Spandex - Global Foundations',  // size=lg (48x48)
  'bcf4ceb47ef2cdef65fe400f088ddd7a8e865223': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bfa978fcbe63b5177bce8afff11e77b2749daf22': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0b03e712d4c160371fc77ab4f18b011b61382454': 'Spandex - Global Foundations',  // size=md (32x32)
  '69fa7e058b0920439c97f644086ccd462867e231': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd51bdaec5edf9649bd82de0e30c324d179425a75': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e7f0ff906aae6cba2fe590b3daa9b4efe162d1fe': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5ca0dd377c489551360e502636f6f174021c2536': 'Spandex - Global Foundations',  // size=xs (16x16)
  '56922992ad114da0229e765e665809f9f27e5f43': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ced87261a13d2725a8ce281d9d5605faa3b98a08': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9c22a2e9f521d2d8de9c8cec2501991118dd1bef': 'Spandex - Global Foundations',  // size=md (32x32)
  'e611b63decda5a062184e0bdd2548734fdb3b58c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5c876c8f06414f159667e323e009a24dc2f24db3': 'Spandex - Global Foundations',  // size=xs (16x16)
  '02489e71741bb501d05df67b39d4e89866112948': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a551eeeb0568d49dd41e8947f55da6791ad70ee9': 'Spandex - Global Foundations',  // size=md (32x32)
  '01ec2e41f6f4f2f790248873b601c5b76a9f3840': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1a8f422cef34c4281e269245c53eefe1164c6a1a': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7973295550f958dbb7d6fdb2af4a79a8b3fbf526': 'Spandex - Global Foundations',  // size=sm (24x24)
  '301a9601ba9f25cc75f834c063c8ae8ce80793ab': 'Spandex - Global Foundations',  // size=md (32x32)
  'bd19df589dbd00d2cffeb9e0f4836acf84310950': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8c6b7ea648dfc27b2793d5c76e4ea008e7786ec0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '28a23f0d05996afb5722c621a4676fbb07adad42': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c56489c87d67893004673833fa85df7dbd315da2': 'Spandex - Global Foundations',  // size=md (32x32)
  'a2a2277e09bea2e96e2a079907a2ceef6bd88d58': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ca22fe33e0088a67704fcfcfbc9f098da24783e6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0ea2eaad97865df45ec186cf730880d949201917': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8b8fb535db06ec529ca688990c848ba144b071e2': 'Spandex - Global Foundations',  // size=md (32x32)
  '4b52b99347bb0c1b45aca35318554bf8d837970a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '86eb6aca257838e9af528a1185c57efd2eb1e28f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c3188e64296938610b72cf584f8a524cececd3dc': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0c760c17548a9955fd33bc02b08601baf84a29cf': 'Spandex - Global Foundations',  // size=md (32x32)
  'c39690c91596391deecf155b2557485b0bae345f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '758479fb79f148a5266927acf427a3f763bdbd3d': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b6354de4d240ebdc33df90affe8082a2eb7cf5a2': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a7286de6b5530540f64c1f849f5f55eeaa4e9188': 'Spandex - Global Foundations',  // size=md (32x32)
  '2845c8917ac810e4e218ec29ed9a27c988402dd5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '08712feee9873ba2ac747ad2f4806234e13a5dd0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '237c109c57a3c977302ca453919b81ce4dede26c': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a8228de0d3d875e8e6e4d689d29039b47b0d76cf': 'Spandex - Global Foundations',  // size=md (32x32)
  '445215617a97db2796aad9009bbf04a4eb8e17b3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9ad97d771df008fce141c41753c48b5dd7f7443e': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a525d6e55f929675f9178f08f06774cf9ff7f28d': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ca8e44eec74a484eab14f9095567192821940d0f': 'Spandex - Global Foundations',  // size=md (32x32)
  '2f77bd947ae67c1c616b8d2090402bdf589686ab': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1af438c3a681b512370662f5eb533e39d48a4ddb': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3d44dc4e3e47dccc2f0cccc911c130b1669b4f21': 'Spandex - Global Foundations',  // size=sm (24x24)
  '210c8e84e4ecb2abc8795f3d6df067c99e5847eb': 'Spandex - Global Foundations',  // size=md (32x32)
  '2bde107a12f8ee050b4c9154090fdd57372bcbe4': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e6b8c4041575dd99c8304e735879d82088dcf020': 'Spandex - Global Foundations',  // size=xs (16x16)
  '45f7647861dbbe8b971381b4b341fafeeab1636d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '17a42357602a7a66b9f16cbd99c53aec4dc38773': 'Spandex - Global Foundations',  // size=md (32x32)
  'e13957b2884125b8e381e565a09e28bc59c6fa47': 'Spandex - Global Foundations',  // size=lg (48x48)
  '31b6c3ed192ae9007a7d9a31fd00d3744173fc3e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '416a6ca062769110c152d7be5837134a31f47b18': 'Spandex - Global Foundations',  // size=sm (24x24)
  '14a67f7535cfa9430ae283c83d5aa46b6f4efd31': 'Spandex - Global Foundations',  // size=md (32x32)
  'f41ae5a3309903fd6cce9fab6a6691483b19f427': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5c6caf7b0a635495fa21cf60adbab21c000063cc': 'Spandex - Global Foundations',  // size=xs (16x16)
  '442b25235223755ad79abc150e81693d766cb3cf': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0b4ca148c0683d04c882e21c783fc479e36194c8': 'Spandex - Global Foundations',  // size=md (32x32)
  '4b981a00b9f2649589ffa0cc6ba149e7d02d2ddb': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2175d58f18daa172712e93fe890ecc1c8df3d909': 'Spandex - Global Foundations',  // size=xs (16x16)
  '41be27c7d0fcfdfb813d3ac82a81557823d19ada': 'Spandex - Global Foundations',  // size=sm (24x24)
  '789bd8086c9e663d315283834c76d64f13aba8ee': 'Spandex - Global Foundations',  // size=md (32x32)
  'cb7dd0917007fb6ef838d5a158137134efdf9249': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c0c07c37ad8ed6c0b4e437eb65d60443b03e258b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'caa1c89352011ce153b90a9bb92ec4be732a3f02': 'Spandex - Global Foundations',  // size=sm (24x24)
  '84b2df9962ae2eecf4686826c0a2c0189a31f85a': 'Spandex - Global Foundations',  // size=md (32x32)
  '3af4f4819ee3a912bd81a9fbc3c368aa62047abe': 'Spandex - Global Foundations',  // size=lg (48x48)
  '036a70059dcf1e0a6285e5ebb5b02502dfc51832': 'Spandex - Global Foundations',  // size=xs (16x16)
  '212bdcec3893011746d58718b0db82a913452b6f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8a02cfe015563465e4abc00a0aaf14b1d37b9777': 'Spandex - Global Foundations',  // size=md (32x32)
  '6b1f575f78c1aa04c39800f694ee45e5bd5c936d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e76230491542a5d86de940dc96241738a979a170': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5fdb0c8ed461d640d4431d579608cbcfc148a40e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '08a8a28440100b88bcb7b4a30bf6339e3a9ec34d': 'Spandex - Global Foundations',  // size=md (32x32)
  'd086036eb38c09b9ae4fb708bbca5d0a0ddab2ba': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ccee8100fb4e2f801be6570399c9a400aa90a5a8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '21c4e7fccdd2fce49362e639dd498470a9f5397c': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd4b089fd0f3f8b079b00f9f2f93d5a9832ba885a': 'Spandex - Global Foundations',  // size=md (32x32)
  '29dd74acf74515a813bfbc04de3eaacad9f90536': 'Spandex - Global Foundations',  // size=lg (48x48)
  '02395301a4eb05ace4ad3ed6b87c21a58f80ea8f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '218809a5e517d7526c56b9e4a6b097b0ab554ed1': 'Spandex - Global Foundations',  // size=sm (24x24)
  '775220f6e8f7db8c6308b94d4f55660cae5ea043': 'Spandex - Global Foundations',  // size=md (32x32)
  '1e5190de0bd47596781257b60f2d5673fb4b1d6e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2e81c62325abe7f06ca5935dbd2f2a772d05d4ec': 'Spandex - Global Foundations',  // size=xs (16x16)
  '59263ade5488cc4775cbb87bde440e9aa430d2b3': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cfadb7eb4ad6676f2c10fa430a14e035765b7f94': 'Spandex - Global Foundations',  // size=md (32x32)
  '5a468682930d6b6aab91b5fb4c038cf657edeeef': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e11b89e9b2daf4caa1b6f08af83c1993e92aeada': 'Spandex - Global Foundations',  // size=xs (16x16)
  '72a9a3d1984410e2b6bb2060d802a0274db66334': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cddf7c2c82f6668292f70b3f757d66c37b92325b': 'Spandex - Global Foundations',  // size=md (32x32)
  '6b3758569a3bb281e08d5bb4d33296cc5b0ffcbb': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6136c17ebd3a09277ff54ae88c85e6ad83f3bd2b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6a2a305ea871bd52232ba44520e225f425dc81a8': 'Spandex - Global Foundations',  // size=sm (24x24)
  '91f1cfb989bbdd9e277c0cf68d4eb0e8881aeb95': 'Spandex - Global Foundations',  // size=md (32x32)
  'e78316101586a5c0c9bc9742bc75c1c554b25a25': 'Spandex - Global Foundations',  // size=lg (48x48)
  '085c6fa54a4ef0acb12b5bdbd16cebd1f52e3336': 'Spandex - Global Foundations',  // size=xs (16x16)
  '69b3edb78b115b5a668c329e387cf0fc384de9fa': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6b59504869511d0eb36500ae60566326384f02ee': 'Spandex - Global Foundations',  // size=md (32x32)
  '2d53469d22169e4c13aae614fde9a2e5df779bde': 'Spandex - Global Foundations',  // size=lg (48x48)
  '58ddf61b0dc83394c11b202d96a63e7d23aed82c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f1468aa64272a3c41604505370663574ecc576ad': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cf511c8b6c0d21edbde724a4666c44cc8af5c907': 'Spandex - Global Foundations',  // size=md (32x32)
  '62fca088561efb95f156ec1cfd89c6985813a2f4': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9f02a222338164bea75d5547a30af23109c94be2': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0a9fac64d849a29f7681d587b35987b7185a07f1': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ba7c0b2f37be9b039bca2df93db8f7fa1a8d7bf0': 'Spandex - Global Foundations',  // size=md (32x32)
  '6f3e5cc0b4f77b9d4323da87ee860fe8fbabfa3e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '559bba6386c704f046211148b9a58839c67636a6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7f612da7a5f532f1d3122931889980c166d38837': 'Spandex - Global Foundations',  // size=sm (24x24)
  '17eed3bfd12ef0c5095a78f183ec3400d6712a24': 'Spandex - Global Foundations',  // size=md (32x32)
  '42bdd76463b4a296a1f9cb353cd5a6613d0a0e7d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '963ad00656cb87b6263a3a8876f049583a01e596': 'Spandex - Global Foundations',  // size=xs (16x16)
  '96d27669fe1e3b73481155dc6c54081aa793873a': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ed3e1d844f64705d81849c5e2963df477901f6aa': 'Spandex - Global Foundations',  // size=md (32x32)
  '77d0691ca1435e023e8c926e8edcb7903ca98757': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd2e950be267a80343ed316a4d6eab3eea9b5802a': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bd719bbe0fe8567f65f3ca463b657126e63afad8': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5754c5f17071f53dbf41d1d2f618656829af800e': 'Spandex - Global Foundations',  // size=md (32x32)
  '5b2522c2f5c2de8a03b091e2f7aab26ed2819700': 'Spandex - Global Foundations',  // size=lg (48x48)
  '142c0903629cef9d959cbc50967b9db87b33c1a2': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3095e2f40214134b5b4ae7e79aae777b5e0e3482': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ecfd31a2363f76082458af9d32bbece73b4e1db6': 'Spandex - Global Foundations',  // size=md (32x32)
  '4e36302b7d72475eca1a6f3469cc6a3ab25f6a8b': 'Spandex - Global Foundations',  // size=lg (48x48)
  '172ff2f981f40285eadc8158d3bc84c0d430a927': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd47d14aebc9aafc542e31d0685907164bc1d4972': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f274228e3f7a0217f86f78769f82a2738463e7a1': 'Spandex - Global Foundations',  // size=md (32x32)
  '003cd414c9c368ecbad94270906ab5ba3807b732': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a615b984db9c3b52a715179e4850e1cd416926ed': 'Spandex - Global Foundations',  // size=xs (16x16)
  '56465f168ccaf02d65f64b8737cd5565e7a653c1': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6c049867ead72be29c880f1e08f7eb20f749eb44': 'Spandex - Global Foundations',  // size=md (32x32)
  'e6a88031f3fd9b965a8a21b63ad08b57904e4886': 'Spandex - Global Foundations',  // size=lg (48x48)
  '770f30343d5dbd1055c3383d4353478776e9ae1a': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3b802231f66f80c766a8cecc21afc2eaf6ab12d7': 'Spandex - Global Foundations',  // size=sm (24x24)
  '72fae504d228625ef3eea1e77c369318197174e8': 'Spandex - Global Foundations',  // size=md (32x32)
  'a672f57f996412932e7c9006c8ea58a0de1a3ff9': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2447e276d3fd580f14ee919213042dc60cfefd07': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b9085771ca8b217fe6246b1c2874914f9152dc21': 'Spandex - Global Foundations',  // size=sm (24x24)
  '019ca4a251105088248e5478df073e935f981524': 'Spandex - Global Foundations',  // size=md (32x32)
  '024fa3e2bba223ddb877e439c36fb849b808521c': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd78624e75c9cd5175cfb1b7f9006b8baa56e80a6': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ecc3801e8e1abd1a84a8a8c83be48f2be8c435d7': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5fd728facd56333f7ffa07b5baf0cbe24258add5': 'Spandex - Global Foundations',  // size=md (32x32)
  '502a1287953a0e99dc0551b3c94a5b52e9783289': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1ee3ad008b15840078b8486f0b043d8331b3ce27': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c1a00d84037e0d1b017f6cd249f8903b86d877cc': 'Spandex - Global Foundations',  // size=sm (24x24)
  '919ab6d7483d8993953aa3548368c347f5ca2f6a': 'Spandex - Global Foundations',  // size=md (32x32)
  '576ae28c40550d0ebb210e07fd474019b1bef4f3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '74aa2d1ea165c0577aa38c0086e1258c2abc5db8': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f6126324b8fc6bafe733ae8df27dcb89bf978a99': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f27178fc5cb2859b6d3f687b04da89c9489b653c': 'Spandex - Global Foundations',  // size=md (32x32)
  'b0ade9d6ce30603c7829a0cca7b9661863054de5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '000e6ebb78483929e6245228c4361d881c0b06aa': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a1a38061bc1e4499f54ca6e1445489d66adc5e6b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e12b851e96ec0c73333eac808be6aec1ccf7403d': 'Spandex - Global Foundations',  // size=md (32x32)
  'dc98c7909054503f23ac38a8fccb27f7e81fa817': 'Spandex - Global Foundations',  // size=lg (48x48)
  '174fd96b8681e0e185a5275d2d955baf186b7b6e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9c33d8c0481ebb245703a1f617cb3ca6c590fe4b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f61eaf600d133d41ece6fcd5ff205ca7658680df': 'Spandex - Global Foundations',  // size=md (32x32)
  '1d04b6431c65fcc8cfa5111c2c12ed8d55fd02ff': 'Spandex - Global Foundations',  // size=lg (48x48)
  '605e30412a9b2ccc5a356afc0f04eebca0a6c3cc': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1eb860f0f5d78033c401d9ac7477c2c7600e3f54': 'Spandex - Global Foundations',  // size=sm (24x24)
  '50a97f804360a2db25fd7c0f8b45a44aa7e64548': 'Spandex - Global Foundations',  // size=md (32x32)
  'e557ad19bc55d67b746b092f913c289f0a9e02d2': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3de884a72c98f4c74329aff4b30b31003ebc5198': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c24b67930c611a8ace94d630caa83df60dfb9914': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a6d7f147a937b9ce9b25b2eaef90a8daa4e98532': 'Spandex - Global Foundations',  // size=md (32x32)
  '4c6f597c090ef843c7066daf2fffb6e42ea03fc2': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f6e555b55a8033a181fec56f2e178bf1293e9d39': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e78ef7e8aed4d006d2cd76b28bcbfd111b7cb72b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '35589f897fba23fdae4ac8216bc9ec8b1426b563': 'Spandex - Global Foundations',  // size=md (32x32)
  'd91fd2fd98f6581fd3241ab12c25386c3497722f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0dcfd8199ec7846f937521adaa55cf63697a6994': 'Spandex - Global Foundations',  // size=xs (16x16)
  '99ea025a47fe6f4916f389bcf55fb1b4c96a4e47': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd2b4fe8fe69ed9dc9a791dafcf03746f61998cee': 'Spandex - Global Foundations',  // size=md (32x32)
  'f4ef24815cbe673f61552d9770e26cbb82481c5e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '088bfffe86055ea605be2388160a92fa06a613cb': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6b5b9d1d8c1b9013c2651112b910796700228651': 'Spandex - Global Foundations',  // size=sm (24x24)
  '76f2308d6d6553ca0f623f4872307310efdf83aa': 'Spandex - Global Foundations',  // size=md (32x32)
  'd6c0c494f06d869e23d8949bce19d9279549096b': 'Spandex - Global Foundations',  // size=lg (48x48)
  '65d4d5ccb816f5fd57bfb258996c18736c69acc3': 'Spandex - Global Foundations',  // size=xs (16x16)
  'efc1f3840510663104cf7e22c8faf539f35d7adb': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2059670d88c69eec9a807153570d24d93ae0c03d': 'Spandex - Global Foundations',  // size=md (32x32)
  'a68db38308b4a6363f064087a1a9ad5171969200': 'Spandex - Global Foundations',  // size=lg (48x48)
  '940e22b80c6927e549dba3f92c1359d037ed4650': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f62a4cea23589caf2a70dfe2b55e0da2097f8fba': 'Spandex - Global Foundations',  // size=sm (24x24)
  '95891b3c3a49bce1d5c66767ab0e2933fae3dcea': 'Spandex - Global Foundations',  // size=md (32x32)
  'ae08d951c3c15485ee9836df1bc4f93423323b99': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cd7b660e762fe2dfd406421c38216c66860ff0bf': 'Spandex - Global Foundations',  // size=xs (16x16)
  'afedee4ad0a3f11faf00b580db55e1d7b35da8e7': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a2a57bdb6f44f2b631cc39dbc40884487a2bf6c0': 'Spandex - Global Foundations',  // size=md (32x32)
  'efc4539dd9bf609c10e1f4bb50ab5fa5f9866cef': 'Spandex - Global Foundations',  // size=lg (48x48)
  '24fca9253b384c9376c5a7559532bd2dfa77b869': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8bce0166fe7c9c5eaa49e0bf45b8e26103d983bb': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b6edd45aa3d0d25a11243144be1aad6a5bebf186': 'Spandex - Global Foundations',  // size=md (32x32)
  '290814f2929f8c2b5fab573d40bba2c286b67c94': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a7d01dd13bfc3cd2d9a20d1b60d90c54322f2892': 'Spandex - Global Foundations',  // size=xs (16x16)
  '765c5b172e6ccc73e26f05df559a0acf16b5ce51': 'Spandex - Global Foundations',  // size=sm (24x24)
  '621348356e780fed0e02f11ff23db0dab026de7a': 'Spandex - Global Foundations',  // size=md (32x32)
  '22d192d4585ca758ed3bf2fd5efa7640d87efa09': 'Spandex - Global Foundations',  // size=lg (48x48)
  '11e25921dee596e499c9fe77cf410233cf1db413': 'Spandex - Global Foundations',  // size=xs (16x16)
  '280cfdfd274b53a8a13038fd97da78439f0daadf': 'Spandex - Global Foundations',  // size=sm (24x24)
  '47ab1b16ead342e7014f87f1162baa83cdf5cf35': 'Spandex - Global Foundations',  // size=md (32x32)
  'c209b8ebe919a9231acf150795ed8b21a6c7b38d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'eacb9aebfae1e07e810c3164653d199740a84420': 'Spandex - Global Foundations',  // size=xs (16x16)
  '12693aa3c7d2b19d7d25002aa1c4003b1750443a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '048660f250c7782196fd38060f7cc14c484cb10a': 'Spandex - Global Foundations',  // size=md (32x32)
  'f914b02118f89a5095f58f823329bc4b201a7f26': 'Spandex - Global Foundations',  // size=lg (48x48)
  '23c95830b3a92875b46304db7b7262ab3b44ee49': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6d0d326ad3db7869fe3ca31d12573c56360bfe09': 'Spandex - Global Foundations',  // size=sm (24x24)
  '04702e7ad3c35ed32331e53835935135d50cc5dd': 'Spandex - Global Foundations',  // size=md (32x32)
  'e3f2ada59611d2ed5633daad46a3d80dd2927e7c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7087ddccc2efb7c590882b8d3873fee18e2dbe39': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e4afed903fca80f56fb46996a081658f414cd600': 'Spandex - Global Foundations',  // size=sm (24x24)
  'af493ca75cb0b82ee0b5a171d27d7e86062bfb21': 'Spandex - Global Foundations',  // size=md (32x32)
  'd85e325cb894ce3ce333e078d1599ba973fe16ec': 'Spandex - Global Foundations',  // size=lg (48x48)
  'aad14502643951eb281da82360ca964d80c2d28c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd954454bf59d0704f582975941feb84a1f895dfc': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b1a3fc49282329fce57c8bfbd78ff2ea7d1919c1': 'Spandex - Global Foundations',  // size=md (32x32)
  '63211de6eb5f879dd3698c55c71d7272f687382f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '367b813a55ea2f55c4f45a336788f33ffb27f0ac': 'Spandex - Global Foundations',  // size=xs (16x16)
  '76a2f17fc766f38fa87990a6f33e78d8f7a5c750': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f871f56f34bf1172276f93d4b01cef97d0bd9f15': 'Spandex - Global Foundations',  // size=md (32x32)
  'a9034e49aabe4c8bd32b23da60e63358d33df82a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'fc42cb64209d356422bdd0ee8c107b53738fb285': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e9152762daf31d5f3829f9d7fd2d47152c252bda': 'Spandex - Global Foundations',  // size=sm (24x24)
  '66f78e9595695daaa5c5e51fedbd0c489b148855': 'Spandex - Global Foundations',  // size=md (32x32)
  '33e9f48f2fedc4c48a823fb77638c341c5a591de': 'Spandex - Global Foundations',  // size=lg (48x48)
  '30268601ccb986e3e4ab5ca4ecd81501e133eb8e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9d3648c860c5fdcf265d3cca4696782f8edd5dc6': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a31370ccc0eed2422be0990dd05b849d285c1857': 'Spandex - Global Foundations',  // size=md (32x32)
  'fa5ceacc229a30f98a027873fd9134a8ba1a4827': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7dc24ec7f4dffd519b36bb7be6e7760c2d1faecf': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a5bc3121575aa343bfd7f6f010138f4feac0b98b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3094e6ba79e427e39fbc420d47720f3275d89e63': 'Spandex - Global Foundations',  // size=md (32x32)
  '0f62b1a1447367c89022c887ea38b27d0234ec36': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b175cf8238fc0d357433cd0d2b5c64470d472cec': 'Spandex - Global Foundations',  // size=xs (16x16)
  'faa03f8259e57c20218c5a39a19552cb7c698213': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cf2154f28b773b2dc84e5e0e06b8f9ab4be812b4': 'Spandex - Global Foundations',  // size=md (32x32)
  '379de837193baf37b53a413e7f45b3a03f3bf6c5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '641fc5192570c9c0dcbc84f74dd19a7d75d9073e': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f99e3905039963ec97200991a6e99d1bc58d9c1c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '320f5e36c01b027c34c4988bbe3447a0e7992ab6': 'Spandex - Global Foundations',  // size=md (32x32)
  '7311f3c4d3b061aec4a533845de65db444d5a572': 'Spandex - Global Foundations',  // size=lg (48x48)
  '643d8b8a8b0b8af3ed0c953611145d24f898111c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1b677b88ffd6364030e2390466cfada07dae9f04': 'Spandex - Global Foundations',  // size=sm (24x24)
  '28852b3e9f953c920469c2358f56fa62d21d1864': 'Spandex - Global Foundations',  // size=md (32x32)
  '786a62b5b74f02e96f1cf507916b8e553e7267e0': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2b1424766e69ee76ae2cc48dd6630f3d7627fb31': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2b624b7281148a3cf559952f3b73d573e9ad427a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9a0e441f760f9e5d29a27c86142e690adefaa98a': 'Spandex - Global Foundations',  // size=md (32x32)
  '50c7381ba93ba84d5d578a8daf4079d7a2681fa7': 'Spandex - Global Foundations',  // size=lg (48x48)
  'fae5f5d7e18265d2d2811db30939b0f4e79fd5e8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7c5bccebec7e7360bf546c7c4e18bf1bfabda611': 'Spandex - Global Foundations',  // size=sm (24x24)
  '07cf0c180f6bda36a4e80bb7ab9fc4a4c61b4713': 'Spandex - Global Foundations',  // size=md (32x32)
  'cbe1ee51343409b627498915ae40ea55292def76': 'Spandex - Global Foundations',  // size=lg (48x48)
  '80ab9f30fe47108db2bcefbd8c08ac569d18790c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd2d27d539090c68717c34e3a129dab1e19285236': 'Spandex - Global Foundations',  // size=sm (24x24)
  '799ea87fd921dd7058a808fbb0eb22a4f2a0f063': 'Spandex - Global Foundations',  // size=md (32x32)
  '8e15e5997fc0365d56e1ae84fe7c8a91cb1227a8': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2c1e7906ecebcc468c677e895bf3a95d06758086': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0649b07c83239539de40450341c1fb6c92f3e64b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'dc49b205c6eae41fac4769b4b5df9a5c9c694bfc': 'Spandex - Global Foundations',  // size=md (32x32)
  '1236f4e879833a48ee0de52f1e8349908b35c374': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a5d109af03f8056e1e5678b465dcb6e283c87d6c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '01c2470320478a5eebc00db519e6a53ea9bae992': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd7b2764a1287d0323d5e3b80d99db3e9491115e1': 'Spandex - Global Foundations',  // size=md (32x32)
  '2294e01e380208fa8a40d9d24456694daa4e1ba1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '00a674deb04e0ee6f9fab748b08019647c6496d4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9e17d237c7d13f0b9c202ea2bcca6cf5988e8c43': 'Spandex - Global Foundations',  // size=sm (24x24)
  'bc8d499c3923e73754f7f2aaa00fbfb4d99dbce8': 'Spandex - Global Foundations',  // size=md (32x32)
  'caf0090b67a176666aec69d075b3b8de3cb826d4': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3e1e05181075e58bb60404142528ab8ed0ed28eb': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3c4fa743e7258efc8303a8b193c0e46c6f8340f9': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd69cbdc4b03b329ebfd9b87e5cad911addac1b73': 'Spandex - Global Foundations',  // size=md (32x32)
  '41020375f72b697f829e250bfb97bc2ea47cbcef': 'Spandex - Global Foundations',  // size=lg (48x48)
  '031b03e6a00a7f7ea5af387369f7441f8f0b9608': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd0ab1d2895df43c8f959de8b66073fccb85c5f03': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd2a6140219b2ab7ac19e1b2e7c397203138e26a8': 'Spandex - Global Foundations',  // size=md (32x32)
  '6261cd803c0717e34cd1f27b7c1f49965fee9279': 'Spandex - Global Foundations',  // size=lg (48x48)
  'fbf8053fa74192b3e374c9303960b024ed528755': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fc81983f43f6a973cf7e2f1b55d29d3d2ca3c6f9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '58002ea48717e2ec4124201716f0d16e074aa985': 'Spandex - Global Foundations',  // size=md (32x32)
  '60c3cb754017870e05b615328c181427626b403e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '771c3be649582a9f9fee8b0b9de5736c445057d4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '965639575fd0665431aaad9e58a44f854e2de84e': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e064e26fc4e7b09aaa190684f5387dc8e0ee6d90': 'Spandex - Global Foundations',  // size=md (32x32)
  'f200e3599fdbd41d96d239e7fabe5dab0c7059ed': 'Spandex - Global Foundations',  // size=lg (48x48)
  '845ef755ca3e39f6d286270071f5fe3e67a129ff': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3937b7d7f273b26c3bc67fcfa5a65cdbb654f2db': 'Spandex - Global Foundations',  // size=sm (24x24)
  '810e9860c24f398f8911c418888d399ad4a0dfb1': 'Spandex - Global Foundations',  // size=md (32x32)
  '3cf381ecc61a768e74c56da609dc3e255fd6aebf': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0cc3e6b6eaca10c6a85b40eab9de847e2eae3b65': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e90d5729885dd758ded7927fb94b415be70c7e45': 'Spandex - Global Foundations',  // size=sm (24x24)
  '57dbd26b617bd5ec76da0098910e4822665a7553': 'Spandex - Global Foundations',  // size=md (32x32)
  '1827b415f537d3a190bce51393ee227c9781d0b0': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7ca1340d22fbc6189d70c81e80dd5d1fad66369c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b7749c56b2b8430b3d9f22bbf2a11bbc8b346a0c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7cedf2d8dcac6822ba372da07ff3baf4b2b7ba93': 'Spandex - Global Foundations',  // size=md (32x32)
  'da7157d0eecf143283cf41c6a07de201fe032e86': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c05724fc7f5712b92c7bd1e4717ec78e2218bded': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f65b69beca9edeade5d0b893041af6caef9229cc': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e9d4c5d7a9de13a1bfe05c6559df0166aebaa701': 'Spandex - Global Foundations',  // size=md (32x32)
  '380335f48542cb3a8151bbb91cddf7d6e5acc185': 'Spandex - Global Foundations',  // size=lg (48x48)
  '601ce493f87fb5329181e9285ee4b11bd2956ff7': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0d2c54081e22830f828f8b49b15d593a4c025896': 'Spandex - Global Foundations',  // size=sm (24x24)
  '89644f59c8f37b9da665f9d2e38760209de50d2c': 'Spandex - Global Foundations',  // size=md (32x32)
  '1e2fc4da610b9279c4059b7f9ed58f9eef8f612b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd9d6a6033e62e22726866ca4c605c86f6ade688b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5f7f28a5e9e7992aebbdb6eda3c72b815fbf9ca3': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ad1beb6f8ddc3c3b275a00544b634df965286b4c': 'Spandex - Global Foundations',  // size=md (32x32)
  '5b81634722eb9b3d9c14a276cbe24e371d2a3932': 'Spandex - Global Foundations',  // size=lg (48x48)
  'dcd5e88d626bf56d92e83e03531f2ae3e0325923': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3631f7031540b2fbf816619a668342e6d1bf1052': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2ba65f1ad40b4457fedca13f08e5d04350fee690': 'Spandex - Global Foundations',  // size=md (32x32)
  'ff5c6bf22a6e5d7bfe544f8fc52c49f206404ccd': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7a2b03a3a1080fb297504ea249609d170cd07183': 'Spandex - Global Foundations',  // size=xs (16x16)
  '22530af65ae07a52f0dbe3d46568decca1e7591e': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f6730f9dcf51ac92d66313268f733d674143671d': 'Spandex - Global Foundations',  // size=md (32x32)
  '5b88ae0526eb2d6af4d3e1ad19dda3d6666cf82e': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c5e95383b75c3390c694f57b1cbec22ce7fa8e3e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '23bb9d55811e3742417e5e402caeb4c5d7531c4d': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b80d6874ca8d986e31e99429d201183299c4fa5d': 'Spandex - Global Foundations',  // size=md (32x32)
  '904c7b3661178cb4fd9e86675e63a2ad1d25a101': 'Spandex - Global Foundations',  // size=lg (48x48)
  '32d98232590af88fa3fb60291520550d7d0d02d7': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c777d66b7fc2edeedf59e907fc23a726247c5828': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ad07c5f8df437a9aca6820b5fd5d012501d362a2': 'Spandex - Global Foundations',  // size=md (32x32)
  'f0720d68236f82590af517b87adf614f3583323f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0fc95bedb12024e4003b353ccc3cbb3fc46b3fca': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6e76f8dffd7284150d4077a7b45361b004be4677': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1c8361a42b599c8baacf7011149b0f1d4efb424f': 'Spandex - Global Foundations',  // size=md (32x32)
  'e6875f47a5986a6bd26a5bb0dc991a6413f84f2d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5021602396647c2b9eaadc57f67476c5a1a1377e': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ba68b41c490694a3defe1487db1c707d2e8c22bb': 'Spandex - Global Foundations',  // size=sm (24x24)
  '972cc9791bd56b8e2fd027b4e54f75f2b91fbacd': 'Spandex - Global Foundations',  // size=md (32x32)
  'b11a08f44831b0dc251e92b872c59d847b2a65de': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd33662f677812852f1759fc05a998e387258a18a': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f2886beceb066ccdb8d0e13541a55c3e890451c6': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4a88f0744819a342742313aab1cef24bb3fb247a': 'Spandex - Global Foundations',  // size=md (32x32)
  '1966894fd85c8384ba74b911a06958df07c65ccf': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ebb09a559bac7c5993d667d5bf8ee146fbda46cc': 'Spandex - Global Foundations',  // size=xs (16x16)
  'eda2b1042100e00626227e8b6f2132a66ef9acd6': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ffb2b73b3646f41340edc160c5bb7076f7fa4700': 'Spandex - Global Foundations',  // size=md (32x32)
  '660552fec408fdd8e4c6124894151e2a8b8c4c6f': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cf421e06f5dc3ef1ac858a778536c89bfca9634f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9c9379ddde93e1d0371122be78b08b843ff668bd': 'Spandex - Global Foundations',  // size=sm (24x24)
  '59111d9b96e1f553dc99ede5af2db0043f7da2ed': 'Spandex - Global Foundations',  // size=md (32x32)
  '3a7cf3742630fc1c59792b3cf18b753c582c9731': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4fa5d6b606952bfa1127971c1fc212ede0763aae': 'Spandex - Global Foundations',  // size=xs (16x16)
  '00c04a337feaa45a77488893220dd2cce96ac6d0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '17612a3f669baf6de9f86c4a4e55ea835754161c': 'Spandex - Global Foundations',  // size=md (32x32)
  '390d00b7c5c8d10e5832d91c4f05d05dbd8f2bd4': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a5814dde2a0b77148b924208942d6292f98e8986': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b9eeec46642a3a8e0618a530cd5f8e30555a350e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '81d7e5b0a5dd3fdfc29d2dda4d50c82b6f1acb68': 'Spandex - Global Foundations',  // size=md (32x32)
  'c49c1a4977b4ce623f9dcc7ec4540a3cec5ac238': 'Spandex - Global Foundations',  // size=lg (48x48)
  '774c2bd3b46ceea7b5aae13fc9e9f198ab93e956': 'Spandex - Global Foundations',  // size=xs (16x16)
  '094c5f2f45b76e29b085f92fe15227b2aa42090d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '062aae926ef7e51c5cea2e13f98952970835f6d8': 'Spandex - Global Foundations',  // size=md (32x32)
  'a38d637bf055d222f9696a36b5476d2460fb9dc5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6631e21db6d431425604df907db66c653d6ef8aa': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8817835ef21bc360f43ae22449162bbfbf3016b2': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8d5752581b2bdfcec7f350fa7f7809bc24d755e1': 'Spandex - Global Foundations',  // size=md (32x32)
  '08ce245f5f3574c6ca4548f3c85c29612e9d6ce4': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f78ed329c1841e5d2fdfa68b7a8cb119c34227ca': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0cd22a3aaf97ff3d3e655f856b26371ee3c5d2cb': 'Spandex - Global Foundations',  // size=sm (24x24)
  '68411926134c28957cb30904a6a36691d7e10b1b': 'Spandex - Global Foundations',  // size=md (32x32)
  '25770f5d2e25cd7142bf6ee85ef5d293de4036a2': 'Spandex - Global Foundations',  // size=lg (48x48)
  '08860283b92481cec5554fa37f9f27e0f7f4a361': 'Spandex - Global Foundations',  // isMyHeatmap=false, isGlobalHeatmap=true, isPOIs=false
  'bcdedecdaa821750fa8db50a21def5df5c50e35d': 'Spandex - Global Foundations',  // isMyHeatmap=true, isGlobalHeatmap=false, isPOIs=false
  'a34d99674bff95b0a47b90a1be8a9ec5e12a34ac': 'Spandex - Global Foundations',  // isMyHeatmap=false, isGlobalHeatmap=false, isPOIs=true
  '4d443d52d5daaf624e73a1ad760d6914e81b0f66': 'Spandex - Global Foundations',  // size=xs (16x16)
  '75b36e3be82aa76962d7616ad704c49f05b3945e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2b69019442f8197571709b995530b63f0027d18e': 'Spandex - Global Foundations',  // size=md (32x32)
  '8a18b7ddb76676b210196dd5bfe7898bae0fb4a1': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c043add5b39aea7f103dc6ecf5b00dc3061054c4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7ef53c97f68c7c53c7cf14325914f58f8dfd0808': 'Spandex - Global Foundations',  // size=sm (24x24)
  'bc1451c847abf15bab6b721d217d9bae18521f03': 'Spandex - Global Foundations',  // size=md (32x32)
  '77f4ac395d16839c4a9d30912af1ba80d2cd0b8b': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8c53bf904627d93bb4c5fee06e2b57265b81773c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8026a5e623126b584d0fd9c68d28f49f6381c2f7': 'Spandex - Global Foundations',  // size=sm (24x24)
  'bf159e7812f1e3be49d6c8b2a10143de7b587eaa': 'Spandex - Global Foundations',  // size=md (32x32)
  '09f4b00644f810311bd1b817fde7553b3013b8e8': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b1870fc59285c4c9d2f2e7ae24d3f6421139e0dc': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8d8bdc7cbd313f9d0730ebcf8db1eb78faaaba0f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '00a967932d137f8118d4883044a739a7e1c81aa1': 'Spandex - Global Foundations',  // size=md (32x32)
  'bc4fd86d3e863048c9a9e4ef1b3da96ce3657089': 'Spandex - Global Foundations',  // size=lg (48x48)
  '63acc3ee5fbb971968e089e443cd8cf6458cebf6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '45fedc6962913c0c1c23afe220c5715aabb0c2b9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0ee0c0b3326ff086ddaee69bc81aca0261fab3bd': 'Spandex - Global Foundations',  // size=md (32x32)
  'cce23599c7c76489172e518139112284bb28d14c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '24caf185d4304c853e168e861bdb74d9f901d98d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5e1e45c3cc49e2412db488f4c496507ce3f1a170': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4832a9a1d71a3d79fc2d819fcce94bf5a48dcc31': 'Spandex - Global Foundations',  // size=md (32x32)
  'be4cff4b5367687dcf103f7941f4192129f00a65': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cb8cd0e6827390730d1593b1350daca620fd1a4c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5d944c874f9211d6084837db41d7baf0aaad41d2': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3f7ae309f13a635efbf7e9713b6173e2da93e028': 'Spandex - Global Foundations',  // size=md (32x32)
  '3fc0e6dcd4f9bbfacb954a31bad4bb89c23f5665': 'Spandex - Global Foundations',  // size=lg (48x48)
  'acfa71241a7ac5a7817965879459eedd8caafcc8': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a81f1f6bc499469c4c02c79b621faa73adbcfc35': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ebe80be267f7af1377db6be1788cb892766f7504': 'Spandex - Global Foundations',  // size=md (32x32)
  'dea9956857e179d19fa38ff7d5940799791a3d40': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f83bff4ead2782b8ed5c9576b9483661a52793f7': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a5ac2a1611f30578509ada31107bfa36b0b82c37': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0f2c6c8b9e91c1e2603e4ef7f3d170c7e841269c': 'Spandex - Global Foundations',  // size=md (32x32)
  '75fb16947bf4fb5686774a643c942960176fca16': 'Spandex - Global Foundations',  // size=lg (48x48)
  'abe5f61e15042945b06afdad1c2aec19ab2154f9': 'Spandex - Global Foundations',  // size=xs (16x16)
  'adceae4bbdea21dbc37850c6a0ca56678a1204ad': 'Spandex - Global Foundations',  // size=sm (24x24)
  '56b6cb652119abcaec945c6f8794eff694381d41': 'Spandex - Global Foundations',  // size=md (32x32)
  '6d3ee0bcb9d49ea535c91b9159f575e21f667add': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a6d4fa5f2b608c39a1abfca5169efa0323b48fde': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f2c2d02f9bddfa82db643ee7ab50cd4f788a2b51': 'Spandex - Global Foundations',  // size=sm (24x24)
  '60cc1dcdc09595ba038441e45e85e6d4860b91d5': 'Spandex - Global Foundations',  // size=md (32x32)
  '098cb3982bdcf30a3d6f71d31fbb66aa427abcca': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e85b3023b8d920d17ea5cf811eafa6e2f46b5b93': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2832fa4185a38c178b1cc1f002911e9d6e47da80': 'Spandex - Global Foundations',  // size=sm (24x24)
  '441090c171ab749b8b6569dd020ac7c1b5aca355': 'Spandex - Global Foundations',  // size=md (32x32)
  'b36cb1b837022e7c8b923aa30504f5670ad013d4': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b7cc9a7c188d77a92822eba154fadb7cdcbca534': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7418af8a96836a68e22d1d345d347b7f57777572': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4d41f95f59195410e8e7ea39070757594a02dd5f': 'Spandex - Global Foundations',  // size=md (32x32)
  '653f9c3b20eddb4e19335855c70a95dc817cba43': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1821add4d0fc362ae40d61c7a3fc39bbbfaa0f51': 'Spandex - Global Foundations',  // size=xs (16x16)
  '21857e841811ed141edbeb812a88fc08d117d891': 'Spandex - Global Foundations',  // size=sm (24x24)
  '31e87f74d3a0a4c8430a25aa491c88cc03b1bc7b': 'Spandex - Global Foundations',  // size=md (32x32)
  '19b3e953bd20de1ef76b81d3b894e94346ccb276': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a3ac154a1bf0bac3840c7a947b5d82c4feb73068': 'Spandex - Global Foundations',  // size=xs (16x16)
  '428e646808ee20e51e50362ad800f2bed921d2f9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '082d35ec83822a8d944ab3ea43f1bb7ba545693d': 'Spandex - Global Foundations',  // size=md (32x32)
  'd1893f7aeb8254c90d3e2d5229f922f7ca96e371': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7d46f5a016bc48ee406dace207ef23f1c13df2a3': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2b02173b45477e1bcaa4d8717c5416f3731d8ceb': 'Spandex - Global Foundations',  // size=sm (24x24)
  '06788b09844462169f02ab3a68955e80c8c0f180': 'Spandex - Global Foundations',  // size=md (32x32)
  '98d09be46a1ef8b18d65f15549918e80651eb6cb': 'Spandex - Global Foundations',  // size=lg (48x48)
  '616f86731f50ca23333f69335a1be8a518a7f8e3': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5e7683ff06074f5aafb0c058c64b46bd292bdafc': 'Spandex - Global Foundations',  // size=sm (24x24)
  '88c3239f388f5f837b10f703e821f80e79be699a': 'Spandex - Global Foundations',  // size=md (32x32)
  '5db306af2063f9184cf383ba286d8029ddef4f26': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7d7b763e32d5092d786339edca9855db6c7a2c23': 'Spandex - Global Foundations',  // size=xs (16x16)
  '50795af8d8d565bfc2ec6381c1e8462ff75ea893': 'Spandex - Global Foundations',  // size=sm (24x24)
  '62adf90510cbe1a1251ce05974f0393963242ff5': 'Spandex - Global Foundations',  // size=md (32x32)
  'cfcd949e707c60658b3bf88bb721e93edf568726': 'Spandex - Global Foundations',  // size=lg (48x48)
  'dacc90264842f2f3c3dd39e501b2525d062f709e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '56388b642993cb4075bd5242b907f58f10b240b6': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b1bc408749df8dce11d85199cd2c051de87492e6': 'Spandex - Global Foundations',  // size=md (32x32)
  '8e9e489537bfb38fce09d6f515fa849d3b5ff50a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f0d834c3f2b1478ee2a472920b11ca66f1db9990': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3103f791b51df7cf579d815ff18d66adf295f48c': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c92937eed4e12213a895660a83bc592ff9d6a3b0': 'Spandex - Global Foundations',  // size=md (32x32)
  '047d1afe2742daed051aae57a78c5a747f503caf': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7c3207e0ccb7dd2545b153790d223ccd49014362': 'Spandex - Global Foundations',  // size=xs (16x16)
  '95ca06547edf0cd3b44397d29b4c6dfd96b60a98': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b99924910179e1ee7eb0cb51fe5c2c35cee47c72': 'Spandex - Global Foundations',  // size=md (32x32)
  '32137acbb0a36ec559d75a8023aed9d8f0d187ac': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8a5bbc2d49220e208216e87f3be5abf3cb25d7da': 'Spandex - Global Foundations',  // size=xs (16x16)
  '14bdffdedb22e5355ec9af2d057fa9aa888c1bc0': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e7d2952d956632a05bb52762296341ba871cef79': 'Spandex - Global Foundations',  // size=md (32x32)
  '9d7d3bdd1723416ae75d6cd18936dd82ab1ac860': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd176a91f3bf30fc676a44aa692363c13c99c88e1': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4cd4e7ab1982630629ada47b3b054e58e2a47367': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5e034eba55b5e8b0bb5aa93e618f4205c99bb23e': 'Spandex - Global Foundations',  // size=md (32x32)
  '55734bcbbebe26d7e3ed28470080677bc5fe182d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8bfc18e44a626664d49239dcbbe82d6a1ee04788': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a8779c2cd38b6f77618faa75ef32e8276dd5be2d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2c8e2300e97984d98f756284d2b9601775271837': 'Spandex - Global Foundations',  // size=md (32x32)
  '95522a7aa9e089b5f73350768bbf3a7fcee3a346': 'Spandex - Global Foundations',  // size=lg (48x48)
  '730eccb6aceb4e0563f958b92d54492923a360d0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '7e18267e7f02f9299e802391eda83e640d32f40b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cc865447e60634ce741aeee7962babd0646813d6': 'Spandex - Global Foundations',  // size=md (32x32)
  '40865e3ed0f40841bbcca50c47c727f1344e5fba': 'Spandex - Global Foundations',  // size=lg (48x48)
  '136581ef2471db16fbc1235333bcc64bd0b08eff': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5a116fa77707168aab35c2ecc5ffa7bf7bd27d62': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9df8dfb1ee51cf20b07ca6a7d1e27be1b76745a3': 'Spandex - Global Foundations',  // size=md (32x32)
  'b7044162f92277b21a3b1f89d63e6e8f46040cae': 'Spandex - Global Foundations',  // size=lg (48x48)
  '23acbc959e8aa94cf8c0565041c2dc8147fc1b63': 'Spandex - Global Foundations',  // size=xs (16x16)
  '80347d72ec3a5e3315f3450bf6392f97c4b5c308': 'Spandex - Global Foundations',  // size=sm (24x24)
  'dcb2c54ec6225f0151fc64559782c52ce98a6d35': 'Spandex - Global Foundations',  // size=md (32x32)
  '37fb0373e9f44095889eee478959930076277417': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2424c4240daf8bfbb2c7ebb9a2374e315f8600fd': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bc455f77df1f16368fa2ebd49c60dbb85cb06688': 'Spandex - Global Foundations',  // size=sm (24x24)
  '01727886433e984aaa1b666d763fd89d7a1e1f23': 'Spandex - Global Foundations',  // size=md (32x32)
  '964841daee8194c48b2856e48a724536b4af2516': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4e77714474cfdeaafe3cc2f542d621f43a91d44c': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f5255d2d60a8e87a38b64fbe2db5383afdcf3f2d': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b8488a5a4a2846ec0aeb61f2ab3bfa40d58c2d49': 'Spandex - Global Foundations',  // size=md (32x32)
  '241b1333f17d2542046ea81b910e4d87a64823bb': 'Spandex - Global Foundations',  // size=lg (48x48)
  '46e6345e1e0318d405a5e03d51c7dc23f1fa16d5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1a9ea955791738802dfafafeae83e28c1dc1bc21': 'Spandex - Global Foundations',  // size=sm (24x24)
  '286e24a378f24a4de72b11edb118296ba6f3e1eb': 'Spandex - Global Foundations',  // size=md (32x32)
  '3e465912afe7978ec18e839fedb6de5f999d77ef': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7958e1c7040f88abf18760bb58ac486817f6843c': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0a944e82832ea276b9476a0cdd113792c8288c64': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6e3a8cecf3739726c8cd394d348a740c4ea9ad39': 'Spandex - Global Foundations',  // size=md (32x32)
  '7baddc0344808e5542c06eeaf8d05d934013751b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a2c73c083e0e8f85349073df61191b424df932d8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '26a26294dde50d7dad2ef7b4ac16a4467213054c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0d53c16631edcb5b4289b30755779242056c13c6': 'Spandex - Global Foundations',  // size=md (32x32)
  '36e8443c18404c7490a73aceb22d78ee6758553c': 'Spandex - Global Foundations',  // size=lg (48x48)
  'af493461287aeb09402659a2e4e708fb22a3c16b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8cbf852123b9295195dabf5d4be97a19a7f103ef': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7d45a7a68e5c76af072d19a9832174cdb9b59ae0': 'Spandex - Global Foundations',  // size=md (32x32)
  '482938f303abec836bb4eb8f549e883cfa7fe67e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5cd7cf7d447f6978317f69ec7b73fa667a865005': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f264234e88139c7f74a9fdd03967f308898737ea': 'Spandex - Global Foundations',  // size=sm (24x24)
  '410354dda02d83a0f51e38aefcb2a5fb6f9c4065': 'Spandex - Global Foundations',  // size=md (32x32)
  'e5ba89ea63f1fe22921c544614bf0f9c52c9e6ad': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6c7b2bba3e915a3fe6966004616feeda5968c4de': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f0facca1785bdd33703a6bd18b9e1753f5ef286e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '510765ff209e547a313638d5191d35a59d71db5b': 'Spandex - Global Foundations',  // size=md (32x32)
  '007ac307710ae1488ea7b86574a159840accd81d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '01d5fb42d75e360f208e16b3e2aff5cd2315304e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9642c62e6e175c6e49473d6320e86016b226fcad': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c25b1ec2932c7eeef6a14bc3d83bf5e1671f8b05': 'Spandex - Global Foundations',  // size=md (32x32)
  'c2fdc86216060902640ea8faa6481f976809bbbf': 'Spandex - Global Foundations',  // size=lg (48x48)
  'adbca544e2f01e4f4ee0a40276435dfa34bc0b46': 'Spandex - Global Foundations',  // size=xs (16x16)
  '518895c593652a021102cd5f3f8984b048a13b6c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4ef8be43d8b226990de52828b5b50c33d01ef874': 'Spandex - Global Foundations',  // size=md (32x32)
  '2534614cb4e6169fb73ba15d2d405544421c6dd7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '433d0312867b5ebbd43fc51ba83a2840ac4ee35f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a95d4e62471cf6c06ff9148ce0283429b4fc179b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '104617f2374e40554f7dde5fe6a2827b10e3dcf5': 'Spandex - Global Foundations',  // size=md (32x32)
  'b5334a03a39d4afa8e40be448223f1bc5c5005ca': 'Spandex - Global Foundations',  // size=lg (48x48)
  'bc891bdfcf40a767164c7942ba56efbb9c1324ec': 'Spandex - Global Foundations',  // size=xs (16x16)
  '90de7af6f0befd7943d398c295e8a03742584789': 'Spandex - Global Foundations',  // size=sm (24x24)
  '44dcf628544ee955a91f40156ad639c837dc2672': 'Spandex - Global Foundations',  // size=md (32x32)
  '550b1372c0eda45eeaec18f5a0082fbdb443d651': 'Spandex - Global Foundations',  // size=lg (48x48)
  '070497eca3ebdaf7d72389d516cded66329ea38e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '5b06ba0b7b9464dc9c3e5bcd08beb72fbf96755a': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a2b4b71082339c6f7f67605512405cf68a617f83': 'Spandex - Global Foundations',  // size=md (32x32)
  'f7a52cfaf3f6d8e5d595d409fbc1212a36de1e1b': 'Spandex - Global Foundations',  // size=lg (48x48)
  '291b388d2ecd60a4fea7fbc30c1b1903193a3ebe': 'Spandex - Global Foundations',  // size=xs (16x16)
  '093c239b4f14ce4a6902a7ddcdb23412e1ef1407': 'Spandex - Global Foundations',  // size=sm (24x24)
  '59f7907fcd59ade5d99ffca5d7185c7741ef6579': 'Spandex - Global Foundations',  // size=md (32x32)
  '62daf9f697a785b58c3b58e3aee4271e0622211a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2cdb34103e7084650bc12409ac5dfae6bb5426b5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '40ae694d9c5673319cbca9818ad1d42101a56034': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4053be994b1555daa31cb542eaf986852ce05fa2': 'Spandex - Global Foundations',  // size=md (32x32)
  '9575984d1384110c400aa1718899b79037b1d43f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6642b901361321ab6e00891bdf9689665fcef4b7': 'Spandex - Global Foundations',  // size=xs (16x16)
  '78a1eba5441785198606c2d6f6fed25219079a51': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5a5e2a61d4feae134a8044142855fc6153834e51': 'Spandex - Global Foundations',  // size=md (32x32)
  '01dba573e0c614ab174472abb67445e02f5d79e1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '742eb7e30d71f4f4d147f8768c94accefcf974fa': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2682f0fc9c558899fa653937810937ad71ab852b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5f99b779fc43c5f4c5b3329298432e0691d9a96a': 'Spandex - Global Foundations',  // size=md (32x32)
  '3d58d854f2bd95c558abf63b24aa5db2665dafcc': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a71ef79e924c409083d130c5b55b6dfca8b21bc0': 'Spandex - Global Foundations',  // size=xs (16x16)
  'bd18c4d158d3393d9681012d6cde530dfdbbe09f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '035add9c66ed9ceea205f6f3cbb68cf8fa236539': 'Spandex - Global Foundations',  // size=md (32x32)
  '4ae0c474cab2243b6c9fae4afba7de99e0c6ef35': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e8a71b05cb5a98b3611e9f4cfe07c954d0649f14': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9e66eb6d7aa9d3f1293e9fabee7db56cac210eb4': 'Spandex - Global Foundations',  // size=sm (24x24)
  '179371bfd19927f143313edbf6d956a105c5fe1a': 'Spandex - Global Foundations',  // size=md (32x32)
  '9158f62571f685873d315388c870c11f7b1a619f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3b84784c2f93aa709aa9620b0102d2a8e4313498': 'Spandex - Global Foundations',  // size=xs (16x16)
  '82fffb9c83c50cc2cc3bb188a0f2a35052df60ec': 'Spandex - Global Foundations',  // size=sm (24x24)
  '25b37b68a559c34577a6d11188cd1d34e3f2d4a0': 'Spandex - Global Foundations',  // size=md (32x32)
  '7ba24270f756cac1ce2dbf41da22ca980767f259': 'Spandex - Global Foundations',  // size=lg (48x48)
  '4b8a29acf6b53b627bd516e3868a4a90f691233d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '62eea18f91e8a0f71a04ae1c6b9ffee9e592799f': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f32c0545df4d0efa8100732709797996d6355105': 'Spandex - Global Foundations',  // size=md (32x32)
  '7362412a6705725a94acbe5b370c1217738ec22e': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6729273f0f8ec23b4647b4688eae239b32ce51b9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2a989d5dbc6972516e430f2e0b0bf534c8894951': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7a3dd04d5678ed86bdfea8c77de67208a7fbc9a1': 'Spandex - Global Foundations',  // size=md (32x32)
  '97b78cb2614688acfce763c9c1bf61acb24e8d3c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '374dbb275566e8a40e4c065be7ecc6640858cea8': 'Spandex - Global Foundations',  // size=xs (16x16)
  '84440383577e8022550d34fadc4c37b3b4c77e45': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd311183f69f6cc86880f3dcd1efb93c601daac5c': 'Spandex - Global Foundations',  // size=md (32x32)
  'a36b7a54da69ec0bdc15ba85efa2bfb3fd4900ff': 'Spandex - Global Foundations',  // size=lg (48x48)
  '47eddf9a95d9817232a108ada0f4961531ce83fe': 'Spandex - Global Foundations',  // size=xs (16x16)
  '05066efee8d1b54bef559613ce1cb73c4f658f2e': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e63c4b5bb35d33459b62b92443ee1b9fc36bbedc': 'Spandex - Global Foundations',  // size=md (32x32)
  'ad9535d2ab836e645d023fcc7afe6a9b9fdf31ba': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c825060f979e9c190175c67125c2faed81cf7140': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c08c9b81639660a2a878111f387dc1fd16ada3b2': 'Spandex - Global Foundations',  // size=sm (24x24)
  '526eeae6b1a6e40845d2306981617f5db7eb33c9': 'Spandex - Global Foundations',  // size=md (32x32)
  '3dea8bb54543d9ad0eaa8734638b62cb03b2b4a7': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ede9c216f814dfd3154530a03a9800f8cb032178': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd8b3ce286d1742a10e973fb6f71d63d93164e69b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e4ee2c165d96c78c895aa984f98c708d7e8be3dc': 'Spandex - Global Foundations',  // size=md (32x32)
  'ed543efede23107a43ccb5d1516140a2246eedd6': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a050a1e78165526f50432f164d39aa28c26f2861': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b286126694387ac2c5e89d5e1475ba21584fca54': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b69091ebd9d36e4e61ef1f97d3d24b73fce41c5f': 'Spandex - Global Foundations',  // size=md (32x32)
  'e0eb08b9f1199776e8e8d322c2b52d43fc7f2a7a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'df3d67575c2b64b7273c38ade4c270e0bd070d0b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '451a42f8d68fb9cd39fb7091c8cd3749d58db21e': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f880f196f1a4d27a656d4c75aef232a5fb34d0a1': 'Spandex - Global Foundations',  // size=md (32x32)
  '6ae8b06a1237036fb9a2af8a69336b1e685f23c1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '748812732f2c675b342d3f6442a540c2dbb8efd1': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b3c887cf17b851e041a8690fcaac3d2719aadfd9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6f6f12ebcd16bd31519c01bf326d42ce562cb4b1': 'Spandex - Global Foundations',  // size=md (32x32)
  '6ed98fd13aa98302781364895854b3ba3a3cba8f': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5cc5d6e3891a324ab761ff5c8a357c0b45a03a5b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '737013ded4669aa12b278ecb190ec004cdfa727d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '297e2b0fc81edea24a7a75b9f629b0bccaec8de6': 'Spandex - Global Foundations',  // size=md (32x32)
  '78a64013f1a543f4dd95dda7a99653298a6595d2': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8ecb35e6946abb9e922eba5e129c5d8521d2a62d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3fb2b8172cc4861d9d94fcacb0a2053a6daea434': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7f1859a34891ae2476e3f4988ca5efebfed843dd': 'Spandex - Global Foundations',  // size=md (32x32)
  '4609ce127ba0bba3a130ff39fe0be97d8a6ce745': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f693afcda525bd3c8e8c36190744e9deb70521bd': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f6686e4cba9e187480b5e58380deded12e53a949': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a0cd962e22a68ee2e45dc07e975608e53fcde964': 'Spandex - Global Foundations',  // size=md (32x32)
  'aabd4ed938d743ae1e88ac6cb50e3ceb43cbcb06': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3c030c8aa9ef34901c872883890f062d0b624fb4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '45289d70ac4f1b13bcf16995357271075d03b8c5': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9f961441764231048452a657ed09e799e5289dd0': 'Spandex - Global Foundations',  // size=md (32x32)
  'dbfc6114b1a299274e5fb5ee2a9806f32548db7b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd4606ca969afc66a87fe00b016d132c6e4ae0aae': 'Spandex - Global Foundations',  // size=xs (16x16)
  'cddb23b46134f1bb35c56f17ed327ed2c696d91a': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b4dc1fcd068d8f72125ee4e362ac30a4ecec559a': 'Spandex - Global Foundations',  // size=md (32x32)
  'af45d3b2ec7bbc05fbadda62a78e845d03db1ddc': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3d2cd743facfc810a620ae1aa247e84d53b3b31f': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aa5115e60d6c8f02d517f959de0b9927549593da': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2262f88004c49a432ff11f4902f66afa69748cee': 'Spandex - Global Foundations',  // size=md (32x32)
  '142f6bcfc668c3d17543815aa3cc03d06ccf4aa5': 'Spandex - Global Foundations',  // size=lg (48x48)
  '85cd9eb3373d558503248698fa17fc7f33e53411': 'Spandex - Global Foundations',  // size=xs (16x16)
  '728e9ad6da3a854412ca9300a754f95ef55b4bb4': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e77830d929afacf883c71c18ea186069bce9eb74': 'Spandex - Global Foundations',  // size=md (32x32)
  'd2eab3534fc7033caabdb5f59f8680f9b3c89616': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1dfd7ee08784ef54164f47c9a424e941ebdf9782': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0cfe41c2549c97ff17b4e85914f481dc9bb122b1': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4375b5d50f59edc18569d28485798e815c2b3765': 'Spandex - Global Foundations',  // size=md (32x32)
  '436440f3a660c0f2aa86aa06b3514cd1cf0be632': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2c859f223c29c9a23946647d96b2bacd8059eadf': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3090ac02b6c30abfbbaa05a10c548ae722b13b24': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1167ce91c29586a84c2048e0c5d52028c62f28b8': 'Spandex - Global Foundations',  // size=md (32x32)
  'dddbf011ff370f837876c99c9d32c8ada86246f6': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd6a4f9e735ffb8f4bc4a280b9456d8e6408ecba9': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a4e873df0d70a2f118a290a20166fe19d06f8bd9': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a330e6cd999619500f304c2cf69268f6d1c44bc7': 'Spandex - Global Foundations',  // size=md (32x32)
  'c29c9c95377176adfb358e56c67fa16787fcf967': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e53b8b8561841c0923a9cf2d817c315713a545f1': 'Spandex - Global Foundations',  // size=xs (16x16)
  '633f42b8306f86e903abaf441727358876c65ed8': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e5d954363a0cd2102ed4944425314c3c6f3f7e93': 'Spandex - Global Foundations',  // size=md (32x32)
  '978f1f78db2f7af1b35fb45bfb9ae049a3b79263': 'Spandex - Global Foundations',  // size=lg (48x48)
  '96310d8417a34b1a85cc93c39b3d785ed7a0bd18': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8cdc737b71271de02f93a10aeffbc7877c465ceb': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e99b14f980e5999b9840b79a607adf21b45d41af': 'Spandex - Global Foundations',  // size=md (32x32)
  'd2baa9c6c00c5487a9cfae4329be80d4d33d0b07': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3063be778d896b7372a905ba4078c4015fdd5909': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a15cefe0184591e2d06e490ae7507a4219117ecc': 'Spandex - Global Foundations',  // size=sm (24x24)
  '611a634bfbf767de8c44820dd8b8db0acfa41658': 'Spandex - Global Foundations',  // size=md (32x32)
  '27c212d1ce249cdb406f4245e55bffed10442289': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b56d7f595dcf249b7b3dfb6148608b8571e03ef2': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9e222a34edb1cb25975d8aaf3d66da983026e0a8': 'Spandex - Global Foundations',  // size=sm (24x24)
  '276f331377894884cc379ec793568eb8f35ac077': 'Spandex - Global Foundations',  // size=md (32x32)
  'b422154a4a4675ab9e9e9e87df16dfd2187f3648': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2ce36ed24be1f48dc463dd21d8136e40f20fff0b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f9d8f4fba8172c1a75f1dac7c0335b4dff2c702e': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3270e3a519188e66c3425c045632f0f5a641a5ab': 'Spandex - Global Foundations',  // size=md (32x32)
  '7fd4e3b3eb1f211f51deab424e0acc07df177711': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9025a1bb393089fee2eabe789810a3d7c1d0874f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '6af1a683ace3081a5e36ac339ae3f3deb34a2bca': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a53b1c7bd6210fde673f0377055d68d2e491b1fb': 'Spandex - Global Foundations',  // size=md (32x32)
  '52d2785f68ce837a479a9706c0c0d6dcbde61d04': 'Spandex - Global Foundations',  // size=lg (48x48)
  '196575206204483087dd583cee1ee70b954d73f6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1f78268ee1001581bc6f3d77b3f21122b45fa30c': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b344c5d58023dab80ca77afa1d457f60ffe19357': 'Spandex - Global Foundations',  // size=md (32x32)
  '0814f9aa5746c061d454661058df3b83628f1c5b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ab472133a7e06cf8818fa013a2da723ba25149ab': 'Spandex - Global Foundations',  // size=xs (16x16)
  '05eba528b35b5e7928e0950bf2c6f93d5313aedc': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b5e260657f297a1e9ce75264b4ad6524354ab06c': 'Spandex - Global Foundations',  // size=md (32x32)
  '903c638fc60dbfd876f48d96e5e1d955d332060d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5506c9da5e2b2acbda18bf10d6e96657757fe433': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b548c6f54a627c7777aa00da99d3a020b086df56': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8c8a3d68c3d25d15c0671ee7574dbaa5dfa138c6': 'Spandex - Global Foundations',  // size=md (32x32)
  '6ff9fa4037436b5c9cc1870371f7c84791f66a65': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8b656086ba51ea00b4087ff5ed476b338266d64d': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c8b2e9ec708629be9ae04a724dc18a8153f4e985': 'Spandex - Global Foundations',  // size=sm (24x24)
  '13b67514227e79d4e299a18f02401050c96a08d6': 'Spandex - Global Foundations',  // size=md (32x32)
  'b4401ed81d01e3f5610731e5c45f2a26592c0727': 'Spandex - Global Foundations',  // size=lg (48x48)
  '309dd982e0f06073524d82a172fa83e44f1799aa': 'Spandex - Global Foundations',  // size=xs (16x16)
  '84083489d36aa9bcfed21d3560a246ed1c37ee7d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3b066f7940e3eb51ed6b12c835f380c62cbeab7d': 'Spandex - Global Foundations',  // size=md (32x32)
  'd469bc360a95d3e8df68ef643e5ad9bc87439dba': 'Spandex - Global Foundations',  // size=lg (48x48)
  '580dd6236a9883eeb0846d84c83187122e5ea083': 'Spandex - Global Foundations',  // size=xs (16x16)
  '47d8738e4c1e31ed709bd136cf101d7477a22397': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4bc1f7616bb928be9357625c402c0b104c2627a2': 'Spandex - Global Foundations',  // size=md (32x32)
  '77887eb95306f5297f3ae4d743ae7198b025c54c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '21652565dff846796507f45a8269bd35e76f7482': 'Spandex - Global Foundations',  // size=xs (16x16)
  '194c9eb9a63ea32a564ea9adb2b0cb52e3bc89c4': 'Spandex - Global Foundations',  // size=sm (24x24)
  '872bbd02ede555c0706ddf77745aad205988b964': 'Spandex - Global Foundations',  // size=md (32x32)
  'eb5108f1f1b73ca97dd7f11cf496e9a0dcfe1827': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2304fd744083e30f6944c99320be7e96d57f55eb': 'Spandex - Global Foundations',  // size=xs (16x16)
  '08121dfcbfa61260cdde48fdba25437f53fac3c2': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1a715697f27cf14fc177f323d599bb0630a23754': 'Spandex - Global Foundations',  // size=md (32x32)
  'efb4fa85fae3cce03eaa0a9d2aa66e0515a5776d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '37c9806a9ae0859337405281c5f09d21b81c50d9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3b152c043954e318d190ff591245d295d5a6b133': 'Spandex - Global Foundations',  // size=sm (24x24)
  '013745a31219de12d372a74e25c7eb5281349173': 'Spandex - Global Foundations',  // size=md (32x32)
  '6ddca77d59749a5bd2dc7f76da3f01c61e6813c3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '40c97e0a481dc79be35471098692eb7d037f6427': 'Spandex - Global Foundations',  // size=xs (16x16)
  '913019e356898687362403530b0ff096ead80d0d': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e746640fbad9cc613652f8c0bd2dc40d8acae8c6': 'Spandex - Global Foundations',  // size=md (32x32)
  '85905f18b193cd169fa4899b50744c3b77f641b8': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd1dc32aeedbb05905148c36087aa10467d4e3564': 'Spandex - Global Foundations',  // size=xs (16x16)
  'ff0c94d13aba12b7d46e48a8929b11817e369af8': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3d9c69059c0377cc6da7c593e5a0d80cd81c6f25': 'Spandex - Global Foundations',  // size=md (32x32)
  '9e1c420a6717320a36a693360e958b3665717173': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ed999a690bd63b6b596730237e4b123b4c277e3a': 'Spandex - Global Foundations',  // size=xs (16x16)
  '20e3618b337692cfc2cdd6ff2e200980b4c0281c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5b8e7350e46ab9ca536faae1d27358426e176614': 'Spandex - Global Foundations',  // size=md (32x32)
  '60fd0a78cb2d18e638124b5040bb18441bbf179b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b3a45029698e7119da82e4bd7dab723925484a04': 'Spandex - Global Foundations',  // size=xs (16x16)
  '16c7c33c55d31feab94652a81a996c948daa1788': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ec1065602ee59519657c7fe9480f5688f615f03c': 'Spandex - Global Foundations',  // size=md (32x32)
  '0716c4535bc6463fe532fe15b99c1242123da958': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b8056b31dc6e5bd8d4e9fb0147fb837d7f6fc1ae': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4e83a7b3026b0b7516ea2c5deb5f7718a1ec2de6': 'Spandex - Global Foundations',  // size=sm (24x24)
  '85d8a78b7c51c7b13412826cb783f7b7d9eddc18': 'Spandex - Global Foundations',  // size=md (32x32)
  '059420fb6789fb8b86cd6c3f9ed38ce35bf734f1': 'Spandex - Global Foundations',  // size=lg (48x48)
  'be9e1b4646b2512eeb30e9a3df68b938c7dd2251': 'Spandex - Global Foundations',  // size=xs (16x16)
  'be75c904ed50b867837c2e0c43e16b96461cd276': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5eaeb643039e6f300088513ff1c1b0ea6d6ae04e': 'Spandex - Global Foundations',  // size=md (32x32)
  '787fbd38dea91b206d6719b0dbecab70b901bded': 'Spandex - Global Foundations',  // size=lg (48x48)
  '02e88125a3476c64f749f3c93cf20057e88a325d': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c26a2442fd00d75dbeb8d5a07c48e2d0f5c28cda': 'Spandex - Global Foundations',  // size=sm (24x24)
  '60aa9c69578880a3b80542ad0c6b3e0e95ec1bad': 'Spandex - Global Foundations',  // size=md (32x32)
  'b15abc449a028f2715381e2bfb02e80ee790b224': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3a4817ae4a2d6d2672d50194997a35acc3112866': 'Spandex - Global Foundations',  // size=xs (16x16)
  '03c7cf0acee87623914ea909837767c664d8fdcb': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a62b08cc2d5f8ba2de5393eb2eab911cbbc1df3d': 'Spandex - Global Foundations',  // size=md (32x32)
  '94b007b18def5505955a816a5c42fa72f99598e1': 'Spandex - Global Foundations',  // size=lg (48x48)
  '70cf2fb912038be7abdcff73397c1c7192820ae9': 'Spandex - Global Foundations',  // size=xs (16x16)
  'dbb723fab6f23b2a4d70dbe4e1e752f0cacc45e4': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7cdb6762139a4a65244dcfd3ef90bd621a39df68': 'Spandex - Global Foundations',  // size=md (32x32)
  '3a5e932a2db1725fab4893913801c47cbf4edc25': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8fe772986845d94d291e1be8faf37212f7f6fdbd': 'Spandex - Global Foundations',  // size=xs (16x16)
  '067aef493c1a305e52f38a02f78c9bcd4a80d415': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5cc106f1e7e106f32d1ea51487a45662aeb65a70': 'Spandex - Global Foundations',  // size=md (32x32)
  'f7b3b785efd29805733bac57218cc827f2cdc98d': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8cd8cc51bd28fa7b9eba48dd870cb49570dcb2f9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '115555788e945dbac3fed5435c89babf38821cef': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd6c59344e7ea2c050b5b90f437ad2217234e7d2e': 'Spandex - Global Foundations',  // size=md (32x32)
  'ebc2c3e43a6717f7e8c6673aec64df87c3b5ec95': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ac6b3876ce7094bdf4582746a669cfe329aacad9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '945f28538a69db4dccf1c68488f3f656e4853cc3': 'Spandex - Global Foundations',  // size=sm (24x24)
  '8654dc6ee7b45876cab6859a5d91f47bcb3f3d5d': 'Spandex - Global Foundations',  // size=md (32x32)
  '150f7f60c03439788eb98e2c3316ff212f864117': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8ac1c4c90f78b9bbc602ffb484edc32b1d879a8b': 'Spandex - Global Foundations',  // size=xs (16x16)
  '51333fe10a57e1aecd181690b4dd02407a25e4a2': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c39fd729aa91e3e3ffae62e9781f6f1c03b8d156': 'Spandex - Global Foundations',  // size=md (32x32)
  'c640f407f23fd6b5b336f550aff8eae4f87295c8': 'Spandex - Global Foundations',  // size=lg (48x48)
  '75d3ed33165806397d14d5d9d5fc0cb24db4a8cd': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2419dc6d33048048e54c519aff464144eae71ab9': 'Spandex - Global Foundations',  // size=sm (24x24)
  '56115715862bf70729d101d30ba9b1b604d12905': 'Spandex - Global Foundations',  // size=md (32x32)
  'de45f569933fda3e1409b0ab9ab06e2328a7fde2': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b0ba12df2c3b36541f725d932b1bdf1673582fc9': 'Spandex - Global Foundations',  // size=xs (16x16)
  'e4dea27f497fc65a2a90e3bc14bcddbd35b4b86a': 'Spandex - Global Foundations',  // size=sm (24x24)
  'cc236c02287bdec38b164ce14987ce77828232a0': 'Spandex - Global Foundations',  // size=md (32x32)
  '5520e9e8f0b4a1ef3b2d1a86062b4998f4457ee0': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ff401daf290a05771bcffe06f93386493cf34e24': 'Spandex - Global Foundations',  // size=xs (16x16)
  'faba898796ca91996a7306d8c0fbe35af2be1268': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6fff48e8c41153026e2539c6ea5967546b385ecf': 'Spandex - Global Foundations',  // size=md (32x32)
  'e9b8bce3e7d561e25928c2f73f47957e52c56749': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b51098ee67df5b9d3793e8d8ec1265e97eed6eab': 'Spandex - Global Foundations',  // size=xs (16x16)
  '1fd8b83b20919d7de5af9d0375ed6b0d8a914390': 'Spandex - Global Foundations',  // size=sm (24x24)
  '12233caf8b1fcaf6fa61c55044aa27a496fce67f': 'Spandex - Global Foundations',  // size=md (32x32)
  '838802536dc7a13a1c6be0adec41e4b21f204ee2': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ff197957f9e1c31b7a4177c474a6b42c9c5b1512': 'Spandex - Global Foundations',  // size=xs (16x16)
  '959d0a29def5f029b678224ab4142224f0844c2d': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e8b9be89c42d8431fd76ee690508b2bb754babd5': 'Spandex - Global Foundations',  // size=md (32x32)
  '0eee1932376bb92616a418b8360b20ecd7b68a5a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '575210c56251995139e595fe27be8a71444961c8': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd7ff509af0f91dfa0312b27eab3325ef286b8ff5': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f65a22d070d2718c5639672f5aca4f956f0ef635': 'Spandex - Global Foundations',  // size=md (32x32)
  '24d560156e718727bb47a8a8f5162ae95c8a34d1': 'Spandex - Global Foundations',  // size=lg (48x48)
  'edc8a619ad214f85a3db72cb111e02294e7a6a21': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8eb9984c72087e5510984b19ebd88760b60fe97f': 'Spandex - Global Foundations',  // size=sm (24x24)
  'd41316a295f2d55d76b835c0f0a711486bf26951': 'Spandex - Global Foundations',  // size=md (32x32)
  '701f0a3f9eb5c8884d96ee455830f1b4d51a090a': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd32b8c82c86dd42ed5f7ed8844ef3d9d24b08533': 'Spandex - Global Foundations',  // size=xs (16x16)
  '52fbf396f2f1e2b629ebe64056e4ec25eec1c395': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5cf5584917e12788ad72e1d3c2e9750e3f6bacda': 'Spandex - Global Foundations',  // size=md (32x32)
  '8859e680d3d1743968bff3513d2c4d2176a88865': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f2031ba8d753fc6c8a60b5422d825e201488b123': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a31ee3b7e16fee0273ce0a09df6664de1925644f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '18938c6afc6358ea6a23d1ea1d4ff4c91be37448': 'Spandex - Global Foundations',  // size=md (32x32)
  'b70deac00ab6e48c97f286e8ae7f0f6bacf19222': 'Spandex - Global Foundations',  // size=lg (48x48)
  '01653531ff1ddb46d463d6d22b7774774e363c35': 'Spandex - Global Foundations',  // size=3xs (8x8)
  'd9a4b2f502f3ae0fbb2d8bc36b170a356ed4b563': 'Spandex - Global Foundations',  // size=3xs (8x8)
  'dc365e3f994202cc1bed34aaed99b5d80e7a021a': 'Spandex - Global Foundations',  // size=3xs (8x8)
  '6ae75727ea2667eed66eb05c468d0dcc98312760': 'Spandex - Global Foundations',  // size=xs (16x16)
  '71a38ebf741f4210d746e4fe37f5f586ac69eb7d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0ad1ffa9205e2b25da62e5d573394da2bd9daeb5': 'Spandex - Global Foundations',  // size=md (32x32)
  '45a9541dcf28b2b404694409e28f5f1958d40426': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b652adcacb24911b0404abb93e68870dfbedd4d3': 'Spandex - Global Foundations',  // size=xs (16x16)
  '145aff7419560cd6d91eacfaa79173c5e2905896': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b900466e99be006dba5a531864bfc075b0855314': 'Spandex - Global Foundations',  // size=md (32x32)
  'c24a40f1fb8d5685a36586b19ec4914a5a8da575': 'Spandex - Global Foundations',  // size=lg (48x48)
  '17cc597ebeb59e4691b8b49826fbc8477b34d37e': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4feaf06f5ae81ec530877914265c272c86e67ab6': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c05ab8ece1fd817b3da934620c7499cdd01a6819': 'Spandex - Global Foundations',  // size=md (32x32)
  '89e0e3d231a004ae037d140f90ce2c0b60614aa4': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b54aa190a91d4eda587dca019c911421d474e0da': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8ef0adb34f9dc84e54673af5a48287791a34f54b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a0698f7b695e4ccf1d598a34670940674e82e1be': 'Spandex - Global Foundations',  // size=md (32x32)
  'c718a4d70bc90e7b7a16d69aefabe98b4ef56a30': 'Spandex - Global Foundations',  // size=lg (48x48)
  '76d61f1379e7eb43632e8271389b7af90d702a13': 'Spandex - Global Foundations',  // size=xs (16x16)
  '84cfaff12800ba01cbe251b7cf04344d1f50f9ff': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ac5b40f4be2ff76a50cb6799bff8cd2c8cb0f308': 'Spandex - Global Foundations',  // size=md (32x32)
  '80b228acbd94268b50d4303a835661d1ad8b6893': 'Spandex - Global Foundations',  // size=lg (48x48)
  '234fbbd94c746c8ded0d46a68d8142e66642ecff': 'Spandex - Global Foundations',  // size=xs (16x16)
  'adf26ea3b5030032e067634ab2b5e971cc92d517': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ce6108ae79771efe439db71059203d6d16a2c428': 'Spandex - Global Foundations',  // size=md (32x32)
  '928b4abfdb5190b78a615f82848c3c7a447585fe': 'Spandex - Global Foundations',  // size=lg (48x48)
  '6a553b9dc60cc18e9d9ea8ef3b465cc4dc24e2d9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '4973de3d6df1652b1524f70451c75ab7e5fb30e0': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b87ac0ed22761749a2de0e3b909bb6f8f257a701': 'Spandex - Global Foundations',  // size=md (32x32)
  'f863db60ca02f305380234b9431b84b2fae86b03': 'Spandex - Global Foundations',  // size=lg (48x48)
  '0785d42b2a5102f59d3f1ee342c2468abd942517': 'Spandex - Global Foundations',  // size=xs (16x16)
  '099b3acdefc94bcc7025d3c5d5fd48daf43b8eea': 'Spandex - Global Foundations',  // size=sm (24x24)
  'b8379c409c470ba894b55bc79ff6ae688a523e4e': 'Spandex - Global Foundations',  // size=md (32x32)
  'f2c327e98f91b6501987b429930682f316e0750b': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a1b253cc823054f96db52104e1b48df76d3256d1': 'Spandex - Global Foundations',  // size=xs (16x16)
  '94daae44f869e9a713e066d463def86ac69d0edd': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5b5c826373171e5099fb013bee6dd1433845eb86': 'Spandex - Global Foundations',  // size=md (32x32)
  '545d101beb4acbd4a25dd5b28a2ddba36cf5de0a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '3a4ec04af74680bea8ff7d794cf51efc49547026': 'Spandex - Global Foundations',  // size=xs (16x16)
  '078bc4d82c7df2e1616981a11d982a317ece115b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e0704e610d8f76a2f7724db1e0da63a4e9eb94b6': 'Spandex - Global Foundations',  // size=md (32x32)
  '5fd87c15f5b4800ec2cccfb55c9db9eb3c94527c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '986bf3b5e44a81bbc24675137f90819fd6346157': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3aad2e1b19629c27edc8491fb73294dc01596c0b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '40886455bea117dc64b004b22cc2cf7d8877b640': 'Spandex - Global Foundations',  // size=md (32x32)
  'ee714a2ebc78493d1068d5c00894e06ec75501a7': 'Spandex - Global Foundations',  // size=lg (48x48)
  '913959bc6f9bdd6922e451bffe98602ea0578652': 'Spandex - Global Foundations',  // size=xs (16x16)
  '29485488677335f0cc52503212ff9a7ae9651b38': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ee08463404009be8331dff8e1d3ab06a9419209f': 'Spandex - Global Foundations',  // size=md (32x32)
  '60ea5de7bc8824500fa76bc50f954f6b851c2577': 'Spandex - Global Foundations',  // size=lg (48x48)
  '13e065cf4901a16d361da817c40703306d630055': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0bb14ecaafb6f197fec62b4d53d019c312e04804': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1db6dffe65b0b0791f49aeb276293005ebac9b29': 'Spandex - Global Foundations',  // size=md (32x32)
  '230e8f1c8c29a5a2a91fdc65d50137a6a3f22323': 'Spandex - Global Foundations',  // size=lg (48x48)
  '1b3af3e989fa2b3dc8984d8ed9809449b44f6a9d': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0b8d9cb2101c9a0c2a2a0508c0da63392718dff4': 'Spandex - Global Foundations',  // size=sm (24x24)
  '095e8543c02e6b3a93deacf94c7147d7e148886a': 'Spandex - Global Foundations',  // size=md (32x32)
  'ba7215fcbf66abd691152bc8e4df8ba866834024': 'Spandex - Global Foundations',  // size=lg (48x48)
  '97da83456c03f540e2e1c7b8032e87dc38cddd66': 'Spandex - Global Foundations',  // size=xs (16x16)
  'fc56590fe8fb78ce94c7cc3e19096b07f58f8a63': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1f719e6dfb9671e100ebbaa41a5be8f470a4a858': 'Spandex - Global Foundations',  // size=md (32x32)
  '2a759f5df36da5c4c6cbfdf5a166edb0aa8f5826': 'Spandex - Global Foundations',  // size=lg (48x48)
  '54fe1dd457d4f50143b9f6b4a2569e031d1accb9': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8fc6f6341c7c8f301c23ef91acff81f9e4d0d7d8': 'Spandex - Global Foundations',  // size=sm (24x24)
  '0006777d4a87f4680be7c89c3769cf749af2cb0b': 'Spandex - Global Foundations',  // size=md (32x32)
  'f97c85dadcf546e6ce188d9edb486bd5cb82604f': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a893cae30fe5f0e5530bc0af114a63cb08284f06': 'Spandex - Global Foundations',  // size=xs (16x16)
  '72419c0aa7675c5803e0b3ef90b3308a29d9ffef': 'Spandex - Global Foundations',  // size=sm (24x24)
  '5869cc881baae2f75ab0970d11a336753a44bc67': 'Spandex - Global Foundations',  // size=md (32x32)
  '34a2b952a61f1bfbe08d15ff8fe1aaf45a42f743': 'Spandex - Global Foundations',  // size=lg (48x48)
  'f29c67207237fe3fd7db032e0759e59ddc6da543': 'Spandex - Global Foundations',  // size=xs (16x16)
  '889977392dcca893db827584dc6f31880df243c6': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2a086cf5573547f867a11a830ec58f73f54403d6': 'Spandex - Global Foundations',  // size=md (32x32)
  'c95218e2e65fe1a3d80a655f9ab00010b0431c02': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a2e2062602229bb73fe2469d6614a3171f2e361f': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0028224a1ae1ee0c1d2db1d8494e5881140c6e3d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '26518b6d6eb39fee24a5de44b56efd38e7c36cf1': 'Spandex - Global Foundations',  // size=md (32x32)
  'c046b909434c2054a83fa24cdf2aa3f38eb3117a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '550ac295724a874fa843c27ea1619b3b5d885914': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8264b7842c287ccd8c33a5159dc78da05ea2cd81': 'Spandex - Global Foundations',  // size=sm (24x24)
  '155a38d809b9437da439f9b2132b2d29206b0774': 'Spandex - Global Foundations',  // size=md (32x32)
  'a089fdbe5640904b553547d00bdb540c8f3343ac': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b47ce2dee224aa6cac944fdf2871d07aca59ad28': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd658b2b38bc325168d9f395b5e254bbff20961f8': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ddcd9effc786e681ceb52f4cc1a52de209cfe729': 'Spandex - Global Foundations',  // size=md (32x32)
  '2ab26c130f093f73e961c8ffd521e7dc8e1ba642': 'Spandex - Global Foundations',  // size=lg (48x48)
  '9a48bf650520bc463eba13c951f66136ba03098e': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f25c58ac52029a3e37ba2508149f261fac34309b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c547b39ebf4df62aa616c82bfe13bebb33cab8df': 'Spandex - Global Foundations',  // size=md (32x32)
  '5a93d739f9bec2b719238a3a6c5bfaa0fe87bf80': 'Spandex - Global Foundations',  // size=lg (48x48)
  '76c80ef165baccea810a0c7d7deaa3c789529af4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '496fc75d7cdc96c8fa8e44f7a80251dcb4a42083': 'Spandex - Global Foundations',  // size=sm (24x24)
  '1f79f560a9d49d84655db8cf8df2f8715704e5ea': 'Spandex - Global Foundations',  // size=md (32x32)
  '7cc5bb4dc08aea3a1375879cf842cefe8fbe55af': 'Spandex - Global Foundations',  // size=lg (48x48)
  'eae1bf8a251588ebd292f3d2dffbac3169073286': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2b7aecf21b2e86b31401f311473d3fdd6c97086c': 'Spandex - Global Foundations',  // size=sm (24x24)
  '31e8bddb6bd83c7aee19822f66bf2287953b67c9': 'Spandex - Global Foundations',  // size=md (32x32)
  'aab751d88091e29829de657d3f85a6f75561f04a': 'Spandex - Global Foundations',  // size=lg (48x48)
  '33165185def9a7c48fd6a61455a3244be985fd01': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f16e451f1f7ddd8e6584b77fb6bb1502d935f334': 'Spandex - Global Foundations',  // size=sm (24x24)
  '3ed677544b373a115d743b1508a54b894775907a': 'Spandex - Global Foundations',  // size=md (32x32)
  '0371f0984543750391ef3d461bf2faca24abc411': 'Spandex - Global Foundations',  // size=lg (48x48)
  'cc822f4c1396b3d28d53b2561f8044989709b674': 'Spandex - Global Foundations',  // size=xs (16x16)
  'aae94547d9456e12bfd762138b885ee2cfff693f': 'Spandex - Global Foundations',  // size=sm (24x24)
  '4210a0f105a51438b76b6e5b3bb57630d7f5d0f6': 'Spandex - Global Foundations',  // size=md (32x32)
  '86b5ca41d29913351118742a568827badce1a771': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c96f2ded6c91dd1196d39755113d13a2ece1b2f1': 'Spandex - Global Foundations',  // size=xs (16x16)
  'cc937e46618d4b15eac37e993afaa09262379f9b': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9d29ec2d98aaa58bc8523638fbcbf5f5e1df2270': 'Spandex - Global Foundations',  // size=md (32x32)
  '8186b2a948d3f3ab1de6657e1735766c8919d0e6': 'Spandex - Global Foundations',  // size=lg (48x48)
  '8219ae4c3491eb15e207af1b87cccc35c1d82e1a': 'Spandex - Global Foundations',  //
  '3dd7337b7bb800898578c6fd6aec5bd3bda53017': 'Spandex - Global Foundations',  //
  '7306db3d4da1bdd2abce120fe5958fbc999791d5': 'Spandex - Global Foundations',  //
  'f35be4728d160da73e3a3e65ff1925d39311fb48': 'Spandex - Global Foundations',  //
  '282755ef8b81e7fe21b40a83c6ad769683722e63': 'Spandex - Global Foundations',  //
  '94131ef2dee58fe243930b7187d56f8f2b2d9234': 'Spandex - Global Foundations',  // size=xs (16x16)
  'abba66c4f6faadaa965ecfa55fc1ba68ff293ce0': 'Spandex - Global Foundations',  // size=sm (24x24)
  'e3e691d699b927bcc569700fcccb1641884624cb': 'Spandex - Global Foundations',  // size=md (32x32)
  '3c4c0655720c00bd3c3e23f3badd0a4b56fd7621': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2c1b7023b493f4863cc126fb90fa944e8fdf49b5': 'Spandex - Global Foundations',  // size=xs (16x16)
  '3ceab5491ebe2c383ab0a756c0df8d710049cc96': 'Spandex - Global Foundations',  // size=sm (24x24)
  '917e73bcb269c945414ee927371add5b3b27c27c': 'Spandex - Global Foundations',  // size=md (32x32)
  'b773f5cd316f12003fec5b58d9f3570f421ff763': 'Spandex - Global Foundations',  // size=lg (48x48)
  '80b98de0471235b816a816508ebf58454294dfa6': 'Spandex - Global Foundations',  // size=xs (16x16)
  '33b1f5e6763c1fd87a22174fcf269d8ce8bb3e25': 'Spandex - Global Foundations',  // size=sm (24x24)
  '24997f0e70ca408b15abbfa871dc7ed839772cd7': 'Spandex - Global Foundations',  // size=md (32x32)
  'ae0e70e02728eaf3914c8d54cfccd930ce9e3fc3': 'Spandex - Global Foundations',  // size=lg (48x48)
  '05333e5d42a5ef898cea900fb2ddaf8cb68f5cd4': 'Spandex - Global Foundations',  // size=xs (16x16)
  '03ab8e0b083102c312d31327aa71da636d4a145b': 'Spandex - Global Foundations',  // size=sm (24x24)
  'ecf27f79b3d387b7c231dcf986e79a22f30f235c': 'Spandex - Global Foundations',  // size=md (32x32)
  'af643bad0b291f1453a37eaefe0d9bed31010d6d': 'Spandex - Global Foundations',  // size=lg (48x48)
  'ffb9985b0c9bd3d01e93f5f6236305ade0c82593': 'Spandex - Global Foundations',  // size=xs (16x16)
  'a1f893fcce5af62559443cedde3e42bb2d6e7e73': 'Spandex - Global Foundations',  // size=sm (24x24)
  'f931184128aebd004c790447d38f17c2ec2c4b15': 'Spandex - Global Foundations',  // size=md (32x32)
  '8d531079340271819621c3ce7acbb7b8dfec5a5c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '70485b48710cb7f68c68715450913f2dbbda99f4': 'Spandex - Global Foundations',  // size=xs (16x16)
  'f47ba2f7f6357ff422c85ab23e79f944ffbbf569': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6adf50e6f4100ce1646541750a4ba1033278e42e': 'Spandex - Global Foundations',  // size=md (32x32)
  'babddffe4d86ba7daccb080cbada4b70b40592d9': 'Spandex - Global Foundations',  // size=lg (48x48)
  '74ad3ccfe6cb25cb627b8cb84bffb0c4200cfbc9': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c7e3cffd901b00f18cf9098b8ad059735192ee93': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9afb067fb93d3065a23248f059b744614bcdba14': 'Spandex - Global Foundations',  // size=md (32x32)
  'ede3ae6417a5156096ec233ace4766967c08ee05': 'Spandex - Global Foundations',  // size=lg (48x48)
  '15204652e5c63ffe54bb859ec0b643edf4fefb32': 'Spandex - Global Foundations',  // size=xs (16x16)
  '86215af4a515ef08794129df08c7940a24784054': 'Spandex - Global Foundations',  // size=sm (24x24)
  '00fa0cb665e8a2b687de18bd3d9bbec0da82fd91': 'Spandex - Global Foundations',  // size=md (32x32)
  '54bcc496871fbad074d52af304b1a65b5792de19': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b9ff8161242ffd8934cb7fc0410c2bdc4a38474b': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd5426cb9f6770ff38ba939e48eeca4a9e57063a0': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2db2bb438e0c313ac170896b12e721b30ee58f37': 'Spandex - Global Foundations',  // size=md (32x32)
  '24869cc8b72b685e03def5adef09f779e98dd597': 'Spandex - Global Foundations',  // size=lg (48x48)
  'd4d6530aef0b531f6e3001f54c2f0301483b4f83': 'Spandex - Global Foundations',  // size=xs (16x16)
  'd68af895a65d95c63624c375d0b1edc3f5a4f38d': 'Spandex - Global Foundations',  // size=sm (24x24)
  '345200785520022315b2a11ec837bfe75e7ed0d5': 'Spandex - Global Foundations',  // size=md (32x32)
  '9483edc07b443169ab70b8bed6c001c85452b555': 'Spandex - Global Foundations',  // size=lg (48x48)
  'e82c9f03bb71480f6467ad0afaa3dfe7ff19872a': 'Spandex - Global Foundations',  // size=xs (16x16)
  '974785aa7f31691ee03e2817532b1606822ee745': 'Spandex - Global Foundations',  // size=sm (24x24)
  '9a3fac5c97772d25a2b316df20dbd6aa93f4f49a': 'Spandex - Global Foundations',  // size=md (32x32)
  'ac6c29c84111abf74a8602bc21fc5facf396cd4c': 'Spandex - Global Foundations',  // size=lg (48x48)
  '7f5d804c6ded584e7e5e449725bf6c5377a26ff7': 'Spandex - Global Foundations',  // size=xs (16x16)
  '0cfd7cf9213b5606aa54702ead5504ed7814848a': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6f1de219e7be9e434d885b2ecbcab29f1d1d8388': 'Spandex - Global Foundations',  // size=md (32x32)
  'f3bd50a4c830db1b1749bf3f48e19195e37e7777': 'Spandex - Global Foundations',  // size=lg (48x48)
  '2e20bbbcf1cb3f5bfc06f7f7a9310c67cc601563': 'Spandex - Global Foundations',  // size=xs (16x16)
  'c969acf4f90ec4bef04d405ccb920c97bfb920ab': 'Spandex - Global Foundations',  // size=sm (24x24)
  '68fec64bf0ae7e7f561d07aabe92e5480eff33d1': 'Spandex - Global Foundations',  // size=md (32x32)
  '13979ba51bb269481a2c9d3a86a3b6703fb86f95': 'Spandex - Global Foundations',  // size=lg (48x48)
  'a357ed8f6f2c2087d0122872219260eb1ed9ce51': 'Spandex - Global Foundations',  // size=xs (16x16)
  'cefea58f771d6b211102f27a8af5bf6c29055d21': 'Spandex - Global Foundations',  // size=sm (24x24)
  'a771d20be422db7f66b0332c9a91fc13c46b8fb4': 'Spandex - Global Foundations',  // size=md (32x32)
  'a2e166986565d1d2da4c99cfdb96d12ecc5ff282': 'Spandex - Global Foundations',  // size=lg (48x48)
  '561d9cad96a05ef7037eb8b78d10b8dd263bccf2': 'Spandex - Global Foundations',  // size=xs (16x16)
  'db4394c2353a61e5534a25a53b69e9936a86f0ec': 'Spandex - Global Foundations',  // size=sm (24x24)
  '7ea022180ea6b91d92f4a5e331cd5542a7c91616': 'Spandex - Global Foundations',  // size=md (32x32)
  '822761d877fd3b4148d28da2f21a5f0ede29a953': 'Spandex - Global Foundations',  // size=lg (48x48)
  'b6d796846be94dbe2ee54cb153f8c82a743c9e5a': 'Spandex - Global Foundations',  // size=xs (16x16)
  '2e87795bc4fcffb89c6deb388b6b2d3e2b7218f5': 'Spandex - Global Foundations',  // size=sm (24x24)
  'c449852d2edefb4a82533f2e8b50d51f47d662aa': 'Spandex - Global Foundations',  // size=md (32x32)
  'aaddaf2e8e28c27893435494b86dc5ee8a3f56ef': 'Spandex - Global Foundations',  // size=lg (48x48)
  '09b9e482d1d6422958e4ed81572bfdaecfa50743': 'Spandex - Global Foundations',  // size=xs (16x16)
  '8e68214cad97f9bd01a5615ad62da7b4804da313': 'Spandex - Global Foundations',  // size=sm (24x24)
  '6bd886b0d3e3331b8823fa00f4027ca3149b6758': 'Spandex - Global Foundations',  // size=md (32x32)
  'de3f8dd24703a8505627d7b258534f2a67993855': 'Spandex - Global Foundations',  // size=lg (48x48)
  '5e353b269d49100f42f7c7eb0bbdcc326a7f6919': 'Spandex - Global Foundations',  // size=xs (16x16)
  'b7d017ff8387b762198d8aadcfe4b479fe967642': 'Spandex - Global Foundations',  // size=sm (24x24)
  '2e5c8b4da42f69abd158d1c8b746a2c1c09b61e8': 'Spandex - Global Foundations',  // size=md (32x32)
  '470bebe457fcd00d40daceaa601aa396fc35f3b0': 'Spandex - Global Foundations',  // size=lg (48x48)
  '76c36811f9bdc54e11b4ce9ed97ca23f9fb24eb0': 'Spandex - Global Foundations',  // size=xs (16x16)
  '9e2d482cd12da56591d53332a81678194cd58b11': 'Spandex - Global Foundations',  // size=sm (24x24)
  '26d1acc9a30b906b4735d60a415a50f3f1aa19f7': 'Spandex - Global Foundations',  // size=md (32x32)
  'a18707ad111e989df80d253586f2f5b42e1d7a49': 'Spandex - Global Foundations',  // size=lg (48x48)
  'c04294aff9973ce9aecf5a7623163a3722677567': 'Spandex - Global Foundations',  // _spacerVertical
  'fea989422e214bdacfcd078e420afa928acd635c': 'Spandex - Global Foundations',  // _spacerHorizontal
  'face2024602f97ae3c743b99d447c31de624de4c': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=4px, Transparent=False, Token=$space-3xs
  'fd754a7f9b3a50c48a32f2b8d1adf2407b345d85': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=4px, Transparent=True, Token=$space-3xs
  '0d2eda6834fed83b43e74caab24e7c073f373df6': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=8px, Transparent=False, Token=$space-2xs
  'c0b560d22d1299eb1f1df43ba8f91099043a3b58': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=8px, Transparent=True, Token=$space-2xs
  '6e084df5cf46d392e1b5ed212f790352a5bfed71': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=12px, Transparent=False, Token=$space-xs
  'aaf721bf824b4e59ce81a1d276641d500c262199': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=12px, Transparent=True, Token=$space-xs
  'b0bda9ad3e76da72ee381ab98a39a12f2314e775': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=16px, Transparent=False, Token=$space-sm
  '53b740e52151341403dfd5559a2a1966fd5fd1bf': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=16px, Transparent=True, Token=$space-sm
  '99c631b8ca7a419a538cd5a1b3d962c0a7885d5e': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=20px, Transparent=False, Token=$space-md
  'cc120fd951fe65368a3daecb4dfc5b14c74cff29': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=20px, Transparent=True, Token=$space-md
  'e619dcbea0231f267751790b21ace610059fadf3': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=24px, Transparent=False, Token=$space-lg
  'b5ea0393e9128463bfb3fb22ea98df604137d0b0': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=24px, Transparent=True, Token=$space-lg
  'f9d06d360a2f52727bc3bf82f42a83d6141db392': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=32px, Transparent=False, Token=$space-xl
  '5cfcdf00b96ea1516b08f2d0902f7d34564387ee': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=32px, Transparent=True, Token=$space-xl
  '77375dc51c312540df5e37f5569a6927e1d712eb': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=40px, Transparent=False, Token=$space-2xl
  'dcf789a4b60d23989255cfd0ab4901dcebd43e2a': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=40px, Transparent=True, Token=$space-2xl
  'f1b0bdc40b920fe9a3978766b1b14e29b00f1ccb': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=48px, Transparent=False, Token=$space-3xl
  '41c13beaf7a9fd95ea05176f1e1940475b97a4a8': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=48px, Transparent=True, Token=$space-3xl
  'c0ea6e1b168032651bf0dd1c14e9c014435089a8': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=64px, Transparent=False, Token=$space-4xl
  '819e9c428279a2a27cfb8725e7b25eef1d3390f9': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=64px, Transparent=True, Token=$space-4xl
  'bd8c9756e933cae38e2611861338f467f9032fc6': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=80px, Transparent=False, Token=$space-5xl
  '405102497705d14c5414d1841e765a87d54d03a0': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=80px, Transparent=True, Token=$space-5xl
  'b8ba9d0c48cf4c095fbfc8c4b5acccd25ae40b74': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=96px, Transparent=False, Token=$space-6xl
  'af504ed1a862e716e1e54852cd18dd56fe3a55a8': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=96px, Transparent=True, Token=$space-6xl
  '1f3986aca3633504bbb8e89870178b63135ff379': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=128px, Transparent=False, Token=$space-7xl
  '84bb90a3e3a6111c6ab882c81373c7bca3fefd5f': 'Spandex - Global Foundations',  // Type=Vertical ↕, Size=128px, Transparent=True, Token=$space-7xl
  '47edfbceddb3c373b252028e75944ceb49369ce8': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=4px, Transparent=False, Token=$space-3xs
  'df9e43a52caffc5f7f62ca89c96c7d68e8f353fc': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=4px, Transparent=True, Token=$space-3xs
  '3940ab1da4454d078d8bc0ef93fc44221dcbd8a9': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=8px, Transparent=False, Token=$space-2xs
  'aab95a83df3ac8d4fef3a50e5babe00a9af6848b': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=8px, Transparent=True, Token=$space-2xs
  '6dca65198d5c3951831ba7356074bd3883fde18d': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=12px, Transparent=False, Token=$space-xs
  'c9ee9aefd961318eafcdc25231b5aa7202a0594e': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=12px, Transparent=True, Token=$space-xs
  'cf77e0f638c5bacb931148c409cdb6e759dae7cf': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=16px, Transparent=False, Token=$space-sm
  '3af57fe020a726f64cd8e1a289022e02c743b114': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=16px, Transparent=True, Token=$space-sm
  '7b20ea2fd64bffae4ec54f69ef3b7abcfa64edcb': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=20px, Transparent=False, Token=$space-md
  'c46a5056cd81ced5f5af037c83760f1d6d1b9279': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=20px, Transparent=True, Token=$space-md
  '9a638f4a17cf3cbc91511f3c26132c653cb0d55e': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=24px, Transparent=False, Token=$space-lg
  '0f0c01a2bbf65898cb1da13f1e1059128a783ca1': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=24px, Transparent=True, Token=$space-lg
  '9999264357aed3d9ae98e4c47d7396a349bd81d2': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=32px, Transparent=False, Token=$space-xl
  '0fe3fc0c2be9c2eabdaad4a9e0b6ce02ac6f107d': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=32px, Transparent=True, Token=$space-xl
  '46d17533feeef8ddc72ae644ed27468aab8cdaf0': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=40px, Transparent=False, Token=$space-2xl
  '51c7abeeb2db65f86b93bd279c684fa29ebfcbe0': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=40px, Transparent=True, Token=$space-2xl
  '452629fe5f1b11269c939853d3e812594da07a5e': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=48px, Transparent=False, Token=$space-3xl
  '509d7313bbe338c9165ee075363309beda704d2a': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=48px, Transparent=True, Token=$space-3xl
  '6817bdb21df5053c0e9a32c6e2c221b686c687ed': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=64px, Transparent=False, Token=$space-4xl
  'e4d5955c718ada6b31d29240e619cd03df4c922d': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=64px, Transparent=True, Token=$space-4xl
  '73af4bcb5f1585f51afc8f8b65bfd987ad34dd6f': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=80px, Transparent=False, Token=$space-5xl
  'd9602c4832b908247df10463833cd8564e7295df': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=80px, Transparent=True, Token=$space-5xl
  '4e9e38e26367c6b9eb022b66b015ae40280fc9fc': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=96px, Transparent=False, Token=$space-6xl
  '80341850d4fbabd6a0cad5733a33332730e3602a': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=96px, Transparent=True, Token=$space-6xl
  '8a26e22aef8b3e2ff6a36989fd76687e83094ffc': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=128px, Transparent=False, Token=$space-7xl
  'c80ac2fb73915f94cc7b09225fe15a08d0a53f52': 'Spandex - Global Foundations',  // Type=Horizontal ↔, Size=128px, Transparent=True, Token=$space-7xl
  '49de450975dd5c463b9018ae05d877adc4176c74': 'Spandex - Global Foundations',  // Horizontal=False, Label Position=← Left
  'e745c23dd318530116f4b56b5d255b8a5d1afa3d': 'Spandex - Global Foundations',  // Horizontal=True, Label Position=↑ Top
  'b7d3bb7f6b58b2d196a86c1e4e85234170a69bad': 'Spandex - Global Foundations',  // Horizontal=True, Label Position=↓ Bottom
  '24fc96462d86364bfd49d1eac08dc89df5d27449': 'Spandex - Global Foundations',  // Horizontal=False, Label Position=→ Right
  'a96cdaf5cda86768298e5df4b6a7199c8c72708b': 'Spandex - Global Foundations',  // isLarge=true, isMedium=false, isSmall=false, isFullWidth=false, isContentful=false, hasMargins=64px
  '0104f53fe14518e6c31a1cb7fd99ef2a4a860eed': 'Spandex - Global Foundations',  // isLarge=false, isMedium=true, isSmall=false, isFullWidth=true, isContentful=false, hasMargins=48px
  'ac697460288d76edaa6af22aa31d0310b190659a': 'Spandex - Global Foundations',  // isLarge=true, isMedium=false, isSmall=false, isFullWidth=true, isContentful=false, hasMargins=64px
  '9a2679eb38d44ac58f3bd619ff229bf06c8b13fd': 'Spandex - Global Foundations',  // isLarge=false, isMedium=false, isSmall=true, isFullWidth=true, isContentful=false, hasMargins=24px
  'af879a652bb423e86e5910f885d99d2697e8ef74': 'Spandex - Global Foundations',  // isLarge=true, isMedium=false, isSmall=false, isFullWidth=false, isContentful=true, hasMargins=32px
  '9f1e74dd9fe843d2e3bcecfebe4ca52d87557b2f': 'Spandex - Global Foundations',  // isLarge=true, isMedium=false, isSmall=false, isFullWidth=true, isContentful=false, hasMargins=16px
  '20ac746ded734d71139d4291810d20cc14472b97': 'Spandex - Global Foundations',  // _Apple Watch Sport Type
  '8cf4ec44860817fbee8bf02941b4e4f87c64345f': 'Spandex - Global Foundations',  // _Apple Watch / Pagination
  '040850d66e53a024d89d8cfce0313af23cc97414': 'Spandex - Global Foundations',  // Label
  '7c8158e99d770893ce90a12b2f42d003a6134338': 'Spandex - Global Foundations',  // Collapsed=true
  '67b540fda1f9febcbfa500c25213eb74a451414a': 'Spandex - Global Foundations',  // Collapsed=false
};


// Variable ID to library mapping
const VARIABLE_ID_TO_LIBRARY: { [id: string]: string } = {
  // ========================================
  // Spandex - Global Foundations Variables
  // ========================================
  'VariableID:26:168235': 'Spandex - Global Foundations',  // brand / color/core/o3
  'VariableID:26:168236': 'Spandex - Global Foundations',  // brand / color/core/asphalt
  'VariableID:26:168237': 'Spandex - Global Foundations',  // brand / color/core/n6
  'VariableID:26:168238': 'Spandex - Global Foundations',  // brand / color/core/n7
  'VariableID:26:168239': 'Spandex - Global Foundations',  // brand / color/core/white
  'VariableID:5651:58248': 'Spandex - Global Foundations',  // brand / color/expanded/lemon
  'VariableID:5651:58249': 'Spandex - Global Foundations',  // brand / color/expanded/teal
  'VariableID:5651:58250': 'Spandex - Global Foundations',  // brand / color/expanded/maroon
  'VariableID:5651:58251': 'Spandex - Global Foundations',  // brand / color/expanded/moss
  'VariableID:5651:58252': 'Spandex - Global Foundations',  // brand / color/expanded/navy
  'VariableID:5651:58253': 'Spandex - Global Foundations',  // brand / color/expanded/sand
  'VariableID:26:168249': 'Spandex - Global Foundations',  // brand / color/achievements/gold
  'VariableID:26:168250': 'Spandex - Global Foundations',  // brand / color/achievements/silver
  'VariableID:26:168251': 'Spandex - Global Foundations',  // brand / color/achievements/bronze
  'VariableID:26:168252': 'Spandex - Global Foundations',  // brand / color/extended/blue/b00
  'VariableID:26:168253': 'Spandex - Global Foundations',  // brand / color/extended/blue/b05
  'VariableID:26:168254': 'Spandex - Global Foundations',  // brand / color/extended/blue/b1
  'VariableID:26:168255': 'Spandex - Global Foundations',  // brand / color/extended/blue/b2
  'VariableID:26:168256': 'Spandex - Global Foundations',  // brand / color/extended/blue/b3
  'VariableID:26:168257': 'Spandex - Global Foundations',  // brand / color/extended/blue/b4
  'VariableID:26:168258': 'Spandex - Global Foundations',  // brand / color/extended/blue/b5
  'VariableID:26:168259': 'Spandex - Global Foundations',  // brand / color/extended/blue/b6
  'VariableID:26:168260': 'Spandex - Global Foundations',  // brand / color/extended/blue/b7
  'VariableID:26:168261': 'Spandex - Global Foundations',  // brand / color/extended/teal/t00
  'VariableID:26:168262': 'Spandex - Global Foundations',  // brand / color/extended/teal/t05
  'VariableID:26:168263': 'Spandex - Global Foundations',  // brand / color/extended/teal/t1
  'VariableID:26:168264': 'Spandex - Global Foundations',  // brand / color/extended/teal/t2
  'VariableID:26:168265': 'Spandex - Global Foundations',  // brand / color/extended/teal/t3
  'VariableID:26:168266': 'Spandex - Global Foundations',  // brand / color/extended/teal/t4
  'VariableID:26:168267': 'Spandex - Global Foundations',  // brand / color/extended/teal/t5
  'VariableID:26:168268': 'Spandex - Global Foundations',  // brand / color/extended/teal/t6
  'VariableID:26:168269': 'Spandex - Global Foundations',  // brand / color/extended/teal/t7
  'VariableID:26:168270': 'Spandex - Global Foundations',  // brand / color/extended/green/g00
  'VariableID:26:168271': 'Spandex - Global Foundations',  // brand / color/extended/green/g05
  'VariableID:26:168272': 'Spandex - Global Foundations',  // brand / color/extended/green/g1
  'VariableID:26:168273': 'Spandex - Global Foundations',  // brand / color/extended/green/g2
  'VariableID:26:168274': 'Spandex - Global Foundations',  // brand / color/extended/green/g3
  'VariableID:26:168275': 'Spandex - Global Foundations',  // brand / color/extended/green/g4
  'VariableID:26:168276': 'Spandex - Global Foundations',  // brand / color/extended/green/g5
  'VariableID:26:168277': 'Spandex - Global Foundations',  // brand / color/extended/green/g6
  'VariableID:26:168278': 'Spandex - Global Foundations',  // brand / color/extended/green/g7
  'VariableID:26:168279': 'Spandex - Global Foundations',  // brand / color/extended/red/r00
  'VariableID:26:168280': 'Spandex - Global Foundations',  // brand / color/extended/red/r05
  'VariableID:26:168281': 'Spandex - Global Foundations',  // brand / color/extended/red/r1
  'VariableID:26:168282': 'Spandex - Global Foundations',  // brand / color/extended/red/r2
  'VariableID:26:168283': 'Spandex - Global Foundations',  // brand / color/extended/red/r3
  'VariableID:26:168284': 'Spandex - Global Foundations',  // brand / color/extended/red/r4
  'VariableID:2798:1351720': 'Spandex - Global Foundations',  // brand / color/extended/red/r45
  'VariableID:26:168285': 'Spandex - Global Foundations',  // brand / color/extended/red/r5
  'VariableID:26:168286': 'Spandex - Global Foundations',  // brand / color/extended/red/r6
  'VariableID:26:168287': 'Spandex - Global Foundations',  // brand / color/extended/red/r7
  'VariableID:26:168288': 'Spandex - Global Foundations',  // brand / color/extended/pink/p00
  'VariableID:26:168289': 'Spandex - Global Foundations',  // brand / color/extended/pink/p05
  'VariableID:26:168290': 'Spandex - Global Foundations',  // brand / color/extended/pink/p1
  'VariableID:26:168291': 'Spandex - Global Foundations',  // brand / color/extended/pink/p2
  'VariableID:26:168292': 'Spandex - Global Foundations',  // brand / color/extended/pink/p3
  'VariableID:26:168293': 'Spandex - Global Foundations',  // brand / color/extended/pink/p4
  'VariableID:26:168294': 'Spandex - Global Foundations',  // brand / color/extended/pink/p5
  'VariableID:26:168295': 'Spandex - Global Foundations',  // brand / color/extended/pink/p6
  'VariableID:26:168296': 'Spandex - Global Foundations',  // brand / color/extended/pink/p7
  'VariableID:26:168297': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y00
  'VariableID:26:168298': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y05
  'VariableID:26:168299': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y1
  'VariableID:26:168300': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y2
  'VariableID:26:168301': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y3
  'VariableID:26:168302': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y4
  'VariableID:26:168303': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y5
  'VariableID:26:168304': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y6
  'VariableID:26:168305': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y7
  'VariableID:26:168306': 'Spandex - Global Foundations',  // brand / color/extended/orange/o00
  'VariableID:26:168307': 'Spandex - Global Foundations',  // brand / color/extended/orange/o05
  'VariableID:26:168308': 'Spandex - Global Foundations',  // brand / color/extended/orange/o1
  'VariableID:26:168309': 'Spandex - Global Foundations',  // brand / color/extended/orange/o2
  'VariableID:26:168310': 'Spandex - Global Foundations',  // brand / color/extended/orange/o3
  'VariableID:26:168311': 'Spandex - Global Foundations',  // brand / color/extended/orange/o4
  'VariableID:26:168312': 'Spandex - Global Foundations',  // brand / color/extended/orange/o5
  'VariableID:26:168313': 'Spandex - Global Foundations',  // brand / color/extended/orange/o6
  'VariableID:26:168314': 'Spandex - Global Foundations',  // brand / color/extended/orange/o7
  'VariableID:26:168315': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n00
  'VariableID:8563:118591': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n025
  'VariableID:26:168316': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n05
  'VariableID:26:168317': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n1
  'VariableID:8563:118592': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n15
  'VariableID:26:168318': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n2
  'VariableID:8563:118593': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n25
  'VariableID:26:168319': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n3
  'VariableID:7770:161382': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n35
  'VariableID:26:168320': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n4
  'VariableID:26:168321': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n45
  'VariableID:26:168322': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n5
  'VariableID:26:168323': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n6
  'VariableID:26:168324': 'Spandex - Global Foundations',  // brand / color/extended/neutral/n7
  'VariableID:26:168325': 'Spandex - Global Foundations',  // brand / color/extended/violet/v00
  'VariableID:26:168326': 'Spandex - Global Foundations',  // brand / color/extended/violet/v05
  'VariableID:26:168327': 'Spandex - Global Foundations',  // brand / color/extended/violet/v1
  'VariableID:26:168328': 'Spandex - Global Foundations',  // brand / color/extended/violet/v2
  'VariableID:26:168329': 'Spandex - Global Foundations',  // brand / color/extended/violet/v3
  'VariableID:26:168330': 'Spandex - Global Foundations',  // brand / color/extended/violet/v4
  'VariableID:26:168331': 'Spandex - Global Foundations',  // brand / color/extended/violet/v5
  'VariableID:26:168332': 'Spandex - Global Foundations',  // brand / color/extended/violet/v6
  'VariableID:26:168333': 'Spandex - Global Foundations',  // brand / color/extended/violet/v7
  'VariableID:26:168334': 'Spandex - Global Foundations',  // brand / color/social/apple/black
  'VariableID:26:168240': 'Spandex - Global Foundations',  // brand / color/secondary/b1
  'VariableID:26:168241': 'Spandex - Global Foundations',  // brand / color/secondary/t2
  'VariableID:26:168242': 'Spandex - Global Foundations',  // brand / color/secondary/g1
  'VariableID:26:168243': 'Spandex - Global Foundations',  // brand / color/secondary/y2
  'VariableID:26:168244': 'Spandex - Global Foundations',  // brand / color/secondary/g5
  'VariableID:26:168245': 'Spandex - Global Foundations',  // brand / color/secondary/o6
  'VariableID:26:168246': 'Spandex - Global Foundations',  // brand / color/secondary/p5
  'VariableID:26:168247': 'Spandex - Global Foundations',  // brand / color/secondary/y5
  'VariableID:26:168248': 'Spandex - Global Foundations',  // brand / color/secondary/t5
  'VariableID:26:168335': 'Spandex - Global Foundations',  // brand / color/social/apple/grey
  'VariableID:26:168336': 'Spandex - Global Foundations',  // brand / color/social/google/blue
  'VariableID:26:168337': 'Spandex - Global Foundations',  // brand / color/social/google/red
  'VariableID:26:168338': 'Spandex - Global Foundations',  // brand / color/social/google/yellow
  'VariableID:26:168339': 'Spandex - Global Foundations',  // brand / color/social/google/green
  'VariableID:26:168340': 'Spandex - Global Foundations',  // brand / color/social/facebook/blue
  'VariableID:26:168341': 'Spandex - Global Foundations',  // brand / color/social/android/black
  'VariableID:26:168342': 'Spandex - Global Foundations',  // brand / color/social/android/green
  'VariableID:26:168343': 'Spandex - Global Foundations',  // brand / color/social/instagram/yellow
  'VariableID:26:168344': 'Spandex - Global Foundations',  // brand / color/social/instagram/orange
  'VariableID:26:168345': 'Spandex - Global Foundations',  // brand / color/social/instagram/red
  'VariableID:26:168346': 'Spandex - Global Foundations',  // brand / color/social/instagram/pink
  'VariableID:26:168347': 'Spandex - Global Foundations',  // brand / color/social/instagram/purple
  'VariableID:26:168348': 'Spandex - Global Foundations',  // brand / color/social/tiktok/black
  'VariableID:26:168349': 'Spandex - Global Foundations',  // brand / color/social/tiktok/white
  'VariableID:26:168350': 'Spandex - Global Foundations',  // brand / color/social/tiktok/red
  'VariableID:26:168351': 'Spandex - Global Foundations',  // brand / color/social/tiktok/blue
  'VariableID:26:168352': 'Spandex - Global Foundations',  // brand / color/social/x/black
  'VariableID:7770:161383': 'Spandex - Global Foundations',  // brand / color/extended/blue/b8
  'VariableID:7770:161384': 'Spandex - Global Foundations',  // brand / color/extended/blue/b9
  'VariableID:7770:161385': 'Spandex - Global Foundations',  // brand / color/extended/teal/t8
  'VariableID:7770:161386': 'Spandex - Global Foundations',  // brand / color/extended/teal/t9
  'VariableID:7770:161387': 'Spandex - Global Foundations',  // brand / color/extended/green/g8
  'VariableID:7770:161388': 'Spandex - Global Foundations',  // brand / color/extended/green/g9
  'VariableID:7770:161389': 'Spandex - Global Foundations',  // brand / color/extended/red/r8
  'VariableID:7770:161390': 'Spandex - Global Foundations',  // brand / color/extended/red/r9
  'VariableID:7770:161391': 'Spandex - Global Foundations',  // brand / color/extended/pink/p8
  'VariableID:7770:161392': 'Spandex - Global Foundations',  // brand / color/extended/pink/p9
  'VariableID:7770:161393': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y8
  'VariableID:7770:161394': 'Spandex - Global Foundations',  // brand / color/extended/yellow/y9
  'VariableID:7770:161395': 'Spandex - Global Foundations',  // brand / color/extended/orange/o8
  'VariableID:7770:161396': 'Spandex - Global Foundations',  // brand / color/extended/orange/o9
  'VariableID:7770:161397': 'Spandex - Global Foundations',  // brand / color/extended/violet/v8
  'VariableID:7770:161398': 'Spandex - Global Foundations',  // brand / color/extended/violet/v9
  'VariableID:101:12144': 'Spandex - Global Foundations',  // platform / border-radius/xs
  'VariableID:101:12145': 'Spandex - Global Foundations',  // platform / border-radius/sm
  'VariableID:101:12146': 'Spandex - Global Foundations',  // platform / border-radius/md
  'VariableID:101:12147': 'Spandex - Global Foundations',  // platform / border-radius/lg
  'VariableID:101:12148': 'Spandex - Global Foundations',  // platform / border-radius/xl
  'VariableID:101:12149': 'Spandex - Global Foundations',  // platform / border-radius/2xl
  'VariableID:101:12150': 'Spandex - Global Foundations',  // platform / border-radius/3xl
  'VariableID:101:12151': 'Spandex - Global Foundations',  // platform / border-radius/4xl
  'VariableID:808:1460149': 'Spandex - Global Foundations',  // platform / border-radius/base
  'VariableID:26:168354': 'Spandex - Global Foundations',  // platform / space/zero
  'VariableID:101:12130': 'Spandex - Global Foundations',  // platform / space/4xs
  'VariableID:101:12131': 'Spandex - Global Foundations',  // platform / space/3xs
  'VariableID:101:12132': 'Spandex - Global Foundations',  // platform / space/2xs
  'VariableID:101:12133': 'Spandex - Global Foundations',  // platform / space/xs
  'VariableID:101:12134': 'Spandex - Global Foundations',  // platform / space/sm
  'VariableID:101:12135': 'Spandex - Global Foundations',  // platform / space/md
  'VariableID:101:12136': 'Spandex - Global Foundations',  // platform / space/lg
  'VariableID:101:12137': 'Spandex - Global Foundations',  // platform / space/xl
  'VariableID:101:12138': 'Spandex - Global Foundations',  // platform / space/2xl
  'VariableID:101:12139': 'Spandex - Global Foundations',  // platform / space/3xl
  'VariableID:101:12140': 'Spandex - Global Foundations',  // platform / space/4xl
  'VariableID:101:12141': 'Spandex - Global Foundations',  // platform / space/5xl
  'VariableID:101:12142': 'Spandex - Global Foundations',  // platform / space/6xl
  'VariableID:101:12143': 'Spandex - Global Foundations',  // platform / space/7xl
  'VariableID:26:168369': 'Spandex - Global Foundations',  // platform / space/base
  'VariableID:820:1617715': 'Spandex - Global Foundations',  // platform / size/base
  'VariableID:1664:2459324': 'Spandex - Global Foundations',  // platform / size/2xs
  'VariableID:820:1617716': 'Spandex - Global Foundations',  // platform / size/xs
  'VariableID:820:1617717': 'Spandex - Global Foundations',  // platform / size/sm
  'VariableID:820:1617718': 'Spandex - Global Foundations',  // platform / size/md
  'VariableID:820:1617719': 'Spandex - Global Foundations',  // platform / size/lg
  'VariableID:820:1617720': 'Spandex - Global Foundations',  // platform / size/xl
  'VariableID:1664:2459325': 'Spandex - Global Foundations',  // platform / size/2xl
  'VariableID:820:1617721': 'Spandex - Global Foundations',  // platform / size/3xl
  'VariableID:1601:521055': 'Spandex - Global Foundations',  // platform / global/corner-radius/inner/round
  'VariableID:1601:521056': 'Spandex - Global Foundations',  // platform / global/corner-radius/inner/rounder
  'VariableID:1601:521057': 'Spandex - Global Foundations',  // platform / global/corner-radius/inner/roundest
  'VariableID:1601:521058': 'Spandex - Global Foundations',  // platform / global/corner-radius/outer/round
  'VariableID:1601:521059': 'Spandex - Global Foundations',  // platform / global/corner-radius/outer/rounder
  'VariableID:1601:521060': 'Spandex - Global Foundations',  // platform / global/corner-radius/outer/roundest
  'VariableID:1601:521061': 'Spandex - Global Foundations',  // platform / global/margin/horizontal/compact
  'VariableID:1601:521062': 'Spandex - Global Foundations',  // platform / global/margin/horizontal/normal
  'VariableID:1601:521063': 'Spandex - Global Foundations',  // platform / global/margin/horizontal/spacious
  'VariableID:1601:521064': 'Spandex - Global Foundations',  // platform / global/margin/vertical/compact
  'VariableID:1601:521065': 'Spandex - Global Foundations',  // platform / global/margin/vertical/normal
  'VariableID:1601:521066': 'Spandex - Global Foundations',  // platform / global/margin/vertical/spacious
  'VariableID:1601:521067': 'Spandex - Global Foundations',  // platform / global/height/row/single-line
  'VariableID:1601:521068': 'Spandex - Global Foundations',  // platform / global/height/row/double-line
  'VariableID:1601:521069': 'Spandex - Global Foundations',  // platform / global/height/divider
  'VariableID:1601:521070': 'Spandex - Global Foundations',  // platform / global/height/header/default
  'VariableID:1601:521071': 'Spandex - Global Foundations',  // platform / global/height/header/empty
  'VariableID:1601:521072': 'Spandex - Global Foundations',  // platform / size/4xl
  'VariableID:1664:2459312': 'Spandex - Global Foundations',  // platform / size/icon/nano
  'VariableID:1664:2459313': 'Spandex - Global Foundations',  // platform / size/icon/micro
  'VariableID:1664:2459314': 'Spandex - Global Foundations',  // platform / size/icon/mini
  'VariableID:1664:2459315': 'Spandex - Global Foundations',  // platform / size/icon/small
  'VariableID:1664:2459316': 'Spandex - Global Foundations',  // platform / size/icon/medium
  'VariableID:1664:2459317': 'Spandex - Global Foundations',  // platform / size/icon/large
  'VariableID:1664:2459318': 'Spandex - Global Foundations',  // platform / size/avatar/nano
  'VariableID:1664:2459319': 'Spandex - Global Foundations',  // platform / size/avatar/micro
  'VariableID:1664:2459320': 'Spandex - Global Foundations',  // platform / size/avatar/mini
  'VariableID:1664:2459321': 'Spandex - Global Foundations',  // platform / size/avatar/small
  'VariableID:1664:2459322': 'Spandex - Global Foundations',  // platform / size/avatar/medium
  'VariableID:1664:2459323': 'Spandex - Global Foundations',  // platform / size/avatar/large
  'VariableID:2533:1324065': 'Spandex - Global Foundations',  // platform / media-query/screen/xs
  'VariableID:2533:1324066': 'Spandex - Global Foundations',  // platform / media-query/screen/sm
  'VariableID:2533:1324067': 'Spandex - Global Foundations',  // platform / media-query/screen/md
  'VariableID:2533:1324068': 'Spandex - Global Foundations',  // platform / media-query/screen/lg
  'VariableID:2533:1324069': 'Spandex - Global Foundations',  // platform / media-query/screen/xl
  'VariableID:2536:1799624': 'Spandex - Global Foundations',  // platform / media-query/screen/max/xs
  'VariableID:2536:1799625': 'Spandex - Global Foundations',  // platform / media-query/screen/max/sm
  'VariableID:2536:1799626': 'Spandex - Global Foundations',  // platform / media-query/screen/max/md
  'VariableID:2536:1799627': 'Spandex - Global Foundations',  // platform / media-query/screen/max/lg
  'VariableID:5651:58254': 'Spandex - Global Foundations',  // platform / font-size/mobile/4xl
  'VariableID:5651:58255': 'Spandex - Global Foundations',  // platform / font-size/mobile/3xl
  'VariableID:5651:58256': 'Spandex - Global Foundations',  // platform / font-size/mobile/2xl
  'VariableID:5651:58257': 'Spandex - Global Foundations',  // platform / font-size/mobile/xl
  'VariableID:5651:58258': 'Spandex - Global Foundations',  // platform / font-size/mobile/lg
  'VariableID:5651:58259': 'Spandex - Global Foundations',  // platform / font-size/mobile/md
  'VariableID:5651:58260': 'Spandex - Global Foundations',  // platform / font-size/mobile/sm
  'VariableID:5651:58261': 'Spandex - Global Foundations',  // platform / font-size/mobile/xs
  'VariableID:5651:58262': 'Spandex - Global Foundations',  // platform / font-size/mobile/2xs
  'VariableID:5651:58263': 'Spandex - Global Foundations',  // platform / font-size/mobile/3xs
  'VariableID:5651:58264': 'Spandex - Global Foundations',  // platform / font-family/maison-neue
  'VariableID:5651:58265': 'Spandex - Global Foundations',  // platform / font-family/maison-neue-extended
  'VariableID:5651:58266': 'Spandex - Global Foundations',  // platform / font-weight/demi
  'VariableID:5651:58267': 'Spandex - Global Foundations',  // platform / font-weight/medium
  'VariableID:5651:58268': 'Spandex - Global Foundations',  // platform / font-weight/book
  'VariableID:5651:58269': 'Spandex - Global Foundations',  // platform / font-size/scale
  'VariableID:5651:58270': 'Spandex - Global Foundations',  // platform / font-size/base
  'VariableID:5651:58271': 'Spandex - Global Foundations',  // platform / font-size/3xs
  'VariableID:5651:58272': 'Spandex - Global Foundations',  // platform / font-size/2xs
  'VariableID:5651:58273': 'Spandex - Global Foundations',  // platform / font-size/xs
  'VariableID:5651:58274': 'Spandex - Global Foundations',  // platform / font-size/sm
  'VariableID:5651:58275': 'Spandex - Global Foundations',  // platform / font-size/md
  'VariableID:5651:58276': 'Spandex - Global Foundations',  // platform / font-size/lg
  'VariableID:5651:58277': 'Spandex - Global Foundations',  // platform / font-size/xl
  'VariableID:5651:58278': 'Spandex - Global Foundations',  // platform / font-size/2xl
  'VariableID:5651:58279': 'Spandex - Global Foundations',  // platform / font-size/3xl
  'VariableID:5651:58280': 'Spandex - Global Foundations',  // platform / font-size/4xl
  'VariableID:5651:58281': 'Spandex - Global Foundations',  // platform / font-size/5xl
  'VariableID:6037:2690399': 'Spandex - Global Foundations',  // platform / font-family/boathouse
  'VariableID:6037:2690400': 'Spandex - Global Foundations',  // platform / font-weight/bold
  'VariableID:6037:2690401': 'Spandex - Global Foundations',  // platform / brand-font-primary
  'VariableID:7770:161399': 'Spandex - Global Foundations',  // platform / font-family/boathouse-extended
  'VariableID:7770:161400': 'Spandex - Global Foundations',  // platform / font-family/boathouse-condensed
  'VariableID:8957:61310': 'Spandex - Global Foundations',  // platform / global/content/divider
  'VariableID:10581:60798': 'Spandex - Global Foundations',  // platform / border-radius/full
  'VariableID:10581:60799': 'Spandex - Global Foundations',  // platform / global/corner-radius/rounded-full
  'VariableID:26:168505': 'Spandex - Global Foundations',  // semantic / color/background/elevation/surface
  'VariableID:26:168506': 'Spandex - Global Foundations',  // semantic / color/background/elevation/surface-selected
  'VariableID:26:168507': 'Spandex - Global Foundations',  // semantic / color/background/elevation/surface-pressed
  'VariableID:26:168511': 'Spandex - Global Foundations',  // semantic / color/background/elevation/raised
  'VariableID:26:168512': 'Spandex - Global Foundations',  // semantic / color/background/elevation/raised-selected
  'VariableID:26:168513': 'Spandex - Global Foundations',  // semantic / color/background/elevation/raised-pressed
  'VariableID:61:323605': 'Spandex - Global Foundations',  // semantic / color/background/elevation/raised-on-sunken
  'VariableID:26:168508': 'Spandex - Global Foundations',  // semantic / color/background/elevation/overlay
  'VariableID:26:168509': 'Spandex - Global Foundations',  // semantic / color/background/elevation/overlay-selected
  'VariableID:26:168510': 'Spandex - Global Foundations',  // semantic / color/background/elevation/overlay-pressed
  'VariableID:802:1014867': 'Spandex - Global Foundations',  // semantic / color/background/elevation/overlay-level-2
  'VariableID:26:168514': 'Spandex - Global Foundations',  // semantic / color/background/elevation/sunken
  'VariableID:26:168515': 'Spandex - Global Foundations',  // semantic / color/background/primary
  'VariableID:26:168516': 'Spandex - Global Foundations',  // semantic / color/background/secondary
  'VariableID:26:168517': 'Spandex - Global Foundations',  // semantic / color/background/tertiary
  'VariableID:26:168518': 'Spandex - Global Foundations',  // semantic / color/text/primary
  'VariableID:26:168519': 'Spandex - Global Foundations',  // semantic / color/text/secondary
  'VariableID:26:168520': 'Spandex - Global Foundations',  // semantic / color/text/tertiary
  'VariableID:26:168521': 'Spandex - Global Foundations',  // semantic / color/text/placeholder
  'VariableID:26:168522': 'Spandex - Global Foundations',  // semantic / color/text/disabled
  'VariableID:26:168523': 'Spandex - Global Foundations',  // semantic / color/text/accent
  'VariableID:26:168524': 'Spandex - Global Foundations',  // semantic / color/text/accent-disabled
  'VariableID:26:168525': 'Spandex - Global Foundations',  // semantic / color/text/inverted/primary
  'VariableID:26:168526': 'Spandex - Global Foundations',  // semantic / color/text/inverted/secondary
  'VariableID:26:168527': 'Spandex - Global Foundations',  // semantic / color/text/inverted/tertiary
  'VariableID:26:168528': 'Spandex - Global Foundations',  // semantic / color/fill/primary
  'VariableID:26:168529': 'Spandex - Global Foundations',  // semantic / color/fill/secondary
  'VariableID:26:168530': 'Spandex - Global Foundations',  // semantic / color/fill/tertiary
  'VariableID:26:168531': 'Spandex - Global Foundations',  // semantic / color/fill/placeholder
  'VariableID:26:168532': 'Spandex - Global Foundations',  // semantic / color/fill/disabled
  'VariableID:26:168533': 'Spandex - Global Foundations',  // semantic / color/fill/accent
  'VariableID:26:168534': 'Spandex - Global Foundations',  // semantic / color/fill/accent-disabled
  'VariableID:26:168535': 'Spandex - Global Foundations',  // semantic / color/fill/inverted/primary
  'VariableID:26:168536': 'Spandex - Global Foundations',  // semantic / color/fill/inverted/secondary
  'VariableID:26:168537': 'Spandex - Global Foundations',  // semantic / color/fill/inverted/tertiary
  'VariableID:26:168538': 'Spandex - Global Foundations',  // semantic / color/border/minimal
  'VariableID:26:168539': 'Spandex - Global Foundations',  // semantic / color/border/subtle
  'VariableID:26:168540': 'Spandex - Global Foundations',  // semantic / color/border/bold
  'VariableID:26:168541': 'Spandex - Global Foundations',  // semantic / color/border/bolder
  'VariableID:26:168542': 'Spandex - Global Foundations',  // semantic / color/border/accent
  'VariableID:26:168543': 'Spandex - Global Foundations',  // semantic / color/border/inverted/primary
  'VariableID:26:168544': 'Spandex - Global Foundations',  // semantic / color/border/inverted/secondary
  'VariableID:26:168545': 'Spandex - Global Foundations',  // semantic / color/border/inverted/tertiary
  'VariableID:26:168546': 'Spandex - Global Foundations',  // semantic / color/global/light
  'VariableID:26:168547': 'Spandex - Global Foundations',  // semantic / color/global/dark
  'VariableID:26:168548': 'Spandex - Global Foundations',  // semantic / color/global/brand
  'VariableID:26:168552': 'Spandex - Global Foundations',  // semantic / color/data-viz/polyline/brand
  'VariableID:26:168553': 'Spandex - Global Foundations',  // semantic / color/data-viz/stats/increase
  'VariableID:26:168554': 'Spandex - Global Foundations',  // semantic / color/data-viz/stats/decrease
  'VariableID:26:168555': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/brand/bolder
  'VariableID:26:168556': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/brand/bold
  'VariableID:26:168557': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/brand/alpha40
  'VariableID:26:168558': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/brand/halo
  'VariableID:26:168559': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/neutral/minimal
  'VariableID:26:168560': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/neutral/subtle
  'VariableID:26:168561': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/neutral/bold
  'VariableID:26:168562': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/neutral/bolder
  'VariableID:26:168563': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/neutral/bold-alpha25
  'VariableID:26:168564': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/track
  'VariableID:26:168565': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/1-bolder
  'VariableID:26:168566': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/1-bold
  'VariableID:26:168567': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/1-subtle
  'VariableID:26:168568': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/1-minimal
  'VariableID:26:168569': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/1-alpha25
  'VariableID:26:168570': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/2-bolder
  'VariableID:26:168571': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/2-bold
  'VariableID:26:168572': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/2-subtle
  'VariableID:26:168573': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/2-minimal
  'VariableID:26:168574': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/2-alpha25
  'VariableID:26:168575': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/3-bolder
  'VariableID:26:168576': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/3-bold
  'VariableID:26:168577': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/3-subtle
  'VariableID:26:168578': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/3-minimal
  'VariableID:26:168579': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/3-alpha25
  'VariableID:26:168580': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/4-bolder
  'VariableID:26:168581': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/4-bold
  'VariableID:26:168582': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/4-subtle
  'VariableID:26:168583': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/4-minimal
  'VariableID:26:168584': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/4-alpha25
  'VariableID:26:168585': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/5-bolder
  'VariableID:26:168586': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/5-bold
  'VariableID:26:168587': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/5-subtle
  'VariableID:26:168588': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/5-minimal
  'VariableID:26:168589': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/5-alpha25
  'VariableID:26:168590': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/6-bolder
  'VariableID:26:168591': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/6-bold
  'VariableID:26:168592': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/6-subtle
  'VariableID:26:168593': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/6-minimal
  'VariableID:26:168594': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/category/6-alpha25
  'VariableID:26:168595': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/high
  'VariableID:26:168596': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/average
  'VariableID:26:168597': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/low
  'VariableID:26:168598': 'Spandex - Global Foundations',  // semantic / color/data-viz/goal/progress
  'VariableID:26:168599': 'Spandex - Global Foundations',  // semantic / color/button/primary/default
  'VariableID:26:168600': 'Spandex - Global Foundations',  // semantic / color/button/primary/pressed
  'VariableID:26:168601': 'Spandex - Global Foundations',  // semantic / color/button/primary/disabled
  'VariableID:26:168602': 'Spandex - Global Foundations',  // semantic / color/button/secondary/pressed
  'VariableID:26:168603': 'Spandex - Global Foundations',  // semantic / color/button/secondary/default-border
  'VariableID:26:168604': 'Spandex - Global Foundations',  // semantic / color/button/secondary/pressed-border
  'VariableID:26:168605': 'Spandex - Global Foundations',  // semantic / color/button/secondary/disabled-border
  'VariableID:26:168606': 'Spandex - Global Foundations',  // semantic / color/button/tertiary/pressed
  'VariableID:10596:158047': 'Spandex - Global Foundations',  // semantic / color/button/destructive/default
  'VariableID:10596:158048': 'Spandex - Global Foundations',  // semantic / color/button/destructive/pressed
  'VariableID:10596:158049': 'Spandex - Global Foundations',  // semantic / color/button/destructive/disabled
  'VariableID:26:168607': 'Spandex - Global Foundations',  // semantic / color/button/foreground/primary
  'VariableID:26:168608': 'Spandex - Global Foundations',  // semantic / color/button/foreground/secondary
  'VariableID:26:168609': 'Spandex - Global Foundations',  // semantic / color/button/foreground/tertiary
  'VariableID:26:168610': 'Spandex - Global Foundations',  // semantic / color/button/foreground/disabled/primary
  'VariableID:26:168611': 'Spandex - Global Foundations',  // semantic / color/button/foreground/disabled/secondary
  'VariableID:26:168612': 'Spandex - Global Foundations',  // semantic / color/button/foreground/disabled/tertiary
  'VariableID:26:168613': 'Spandex - Global Foundations',  // semantic / color/button/floating/secondary/default
  'VariableID:26:168614': 'Spandex - Global Foundations',  // semantic / color/button/floating/secondary/pressed
  'VariableID:26:168615': 'Spandex - Global Foundations',  // semantic / color/button/floating/secondary/disabled
  'VariableID:26:168616': 'Spandex - Global Foundations',  // semantic / color/button/floating/tertiary/default
  'VariableID:26:168617': 'Spandex - Global Foundations',  // semantic / color/button/floating/tertiary/pressed
  'VariableID:26:168618': 'Spandex - Global Foundations',  // semantic / color/button/floating/tertiary/disabled
  'VariableID:10684:674': 'Spandex - Global Foundations',  // semantic / color/inline-callout/background/default
  'VariableID:10684:675': 'Spandex - Global Foundations',  // semantic / color/inline-callout/background/error
  'VariableID:10684:676': 'Spandex - Global Foundations',  // semantic / color/inline-callout/background/success
  'VariableID:10684:677': 'Spandex - Global Foundations',  // semantic / color/inline-callout/background/attention
  'VariableID:26:168619': 'Spandex - Global Foundations',  // semantic / color/slider/track/base
  'VariableID:26:168620': 'Spandex - Global Foundations',  // semantic / color/slider/track/fill
  'VariableID:26:168621': 'Spandex - Global Foundations',  // semantic / color/slider/track/mark/primary
  'VariableID:26:168622': 'Spandex - Global Foundations',  // semantic / color/slider/track/mark/secondary
  'VariableID:26:168623': 'Spandex - Global Foundations',  // semantic / color/slider/track/mark/tertiary
  'VariableID:26:168624': 'Spandex - Global Foundations',  // semantic / color/slider/knob/white
  'VariableID:26:168625': 'Spandex - Global Foundations',  // semantic / color/slider/knob/green
  'VariableID:26:168626': 'Spandex - Global Foundations',  // semantic / color/slider/knob/dark-gray
  'VariableID:2707:1405178': 'Spandex - Global Foundations',  // semantic / color/global/status/error/foreground
  'VariableID:41:471710': 'Spandex - Global Foundations',  // semantic / color/global/status/error
  'VariableID:41:778550': 'Spandex - Global Foundations',  // semantic / color/global/status/success
  'VariableID:41:778551': 'Spandex - Global Foundations',  // semantic / color/global/status/info
  'VariableID:41:778552': 'Spandex - Global Foundations',  // semantic / color/global/status/warning
  'VariableID:582:900793': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-1
  'VariableID:582:900794': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-2
  'VariableID:582:900795': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-3
  'VariableID:582:900796': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-4
  'VariableID:582:900797': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-5
  'VariableID:582:900798': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-6
  'VariableID:582:900799': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/zone-7
  'VariableID:582:900800': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-1
  'VariableID:582:900801': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-2
  'VariableID:582:900802': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-3
  'VariableID:582:900803': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-4
  'VariableID:582:900804': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-5
  'VariableID:582:900805': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-6
  'VariableID:582:900806': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/zone-7
  'VariableID:582:900807': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-1
  'VariableID:582:900808': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-2
  'VariableID:582:900809': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-3
  'VariableID:582:900810': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-4
  'VariableID:582:900811': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-5
  'VariableID:582:900812': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-6
  'VariableID:582:900813': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/zone-7
  'VariableID:582:900814': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-1
  'VariableID:582:900815': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-2
  'VariableID:582:900816': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-3
  'VariableID:582:900817': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-4
  'VariableID:582:900818': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-5
  'VariableID:582:900819': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-6
  'VariableID:582:900820': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/zone-7
  'VariableID:653:15520': 'Spandex - Global Foundations',  // semantic / color/scrim
  'VariableID:802:1014868': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/suggested-range-alpha15
  'VariableID:817:18705': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/halo/high
  'VariableID:817:18706': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/halo/average
  'VariableID:817:18707': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/halo/low
  'VariableID:817:18708': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/heart-rate/halo
  'VariableID:817:18709': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/power/halo
  'VariableID:817:18710': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/cadence/halo
  'VariableID:817:18711': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/pace/halo
  'VariableID:865:426305': 'Spandex - Global Foundations',  // semantic / color/tag/delta/increasing/fill
  'VariableID:865:426306': 'Spandex - Global Foundations',  // semantic / color/tag/delta/increasing/text
  'VariableID:865:426307': 'Spandex - Global Foundations',  // semantic / color/tag/delta/increasing/background
  'VariableID:865:426308': 'Spandex - Global Foundations',  // semantic / color/tag/delta/decreasing/fill
  'VariableID:865:426309': 'Spandex - Global Foundations',  // semantic / color/tag/delta/decreasing/text
  'VariableID:865:426310': 'Spandex - Global Foundations',  // semantic / color/tag/delta/decreasing/background
  'VariableID:1131:40665': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/extreme/foreground
  'VariableID:1131:40666': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/extreme/background
  'VariableID:1131:40667': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/extreme/border
  'VariableID:865:426311': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/hard/foreground
  'VariableID:865:426312': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/hard/background
  'VariableID:865:426313': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/hard/border
  'VariableID:865:426314': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/moderate/foreground
  'VariableID:865:426315': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/moderate/background
  'VariableID:865:426316': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/moderate/border
  'VariableID:865:426317': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/easy/foreground
  'VariableID:865:426318': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/easy/background
  'VariableID:865:426319': 'Spandex - Global Foundations',  // semantic / color/tag/difficulty/easy/border
  'VariableID:865:427972': 'Spandex - Global Foundations',  // semantic / color/tag/delta/neutral/fill
  'VariableID:865:427973': 'Spandex - Global Foundations',  // semantic / color/tag/delta/neutral/text
  'VariableID:865:427974': 'Spandex - Global Foundations',  // semantic / color/tag/delta/neutral/background
  'VariableID:889:1267355': 'Spandex - Global Foundations',  // semantic / color/messaging/background/recipient
  'VariableID:889:1267356': 'Spandex - Global Foundations',  // semantic / color/messaging/background/sender
  'VariableID:894:2076523': 'Spandex - Global Foundations',  // semantic / color/segmented-controls/enabled
  'VariableID:894:2076524': 'Spandex - Global Foundations',  // semantic / color/segmented-controls/pressed
  'VariableID:894:2076525': 'Spandex - Global Foundations',  // semantic / color/segmented-controls/selected
  'VariableID:900:2472709': 'Spandex - Global Foundations',  // semantic / color/segmented-controls/disabled
  'VariableID:920:5453771': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/elevation
  'VariableID:928:926794': 'Spandex - Global Foundations',  // semantic / color/button/secondary/alt/foreground
  'VariableID:928:926795': 'Spandex - Global Foundations',  // semantic / color/button/secondary/alt/border
  'VariableID:1011:3704771': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/activity-value/high
  'VariableID:1011:3704772': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/activity-value/average
  'VariableID:1011:3704773': 'Spandex - Global Foundations',  // semantic / color/data-viz/graph/relative-effort/activity-value/low
  'VariableID:1050:39490': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/walk
  'VariableID:1050:39499': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/run
  'VariableID:1050:39506': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/virtual-run
  'VariableID:1735:41395': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/long-run
  'VariableID:1050:39517': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/hike
  'VariableID:1050:39495': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/ride
  'VariableID:1050:39492': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/virtual-ride
  'VariableID:1050:39494': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/e-bike-ride
  'VariableID:1050:39514': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/velomobile-ride
  'VariableID:1050:39493': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/swim
  'VariableID:1050:39502': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/canoe
  'VariableID:1050:39513': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/surf
  'VariableID:1050:39501': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/kitesurf-session
  'VariableID:1050:39498': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/row
  'VariableID:1050:39526': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/windsurf-session
  'VariableID:1050:39520': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/kayak
  'VariableID:1050:39518': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/stand-up-paddle
  'VariableID:1050:39508': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/sail
  'VariableID:1050:39507': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/ice-skate
  'VariableID:1050:39503': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/snowboard
  'VariableID:1050:39504': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/snowshoe
  'VariableID:1050:39500': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/alpine-ski
  'VariableID:1050:39512': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/backcountry-ski
  'VariableID:1050:39523': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/nordic-ski
  'VariableID:1050:39515': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/roller-ski
  'VariableID:1050:39516': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/handcycle
  'VariableID:1050:39521': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/inline-skate
  'VariableID:1050:39519': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/rock-climb
  'VariableID:1050:39505': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/golf
  'VariableID:1050:39509': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/football-soccer
  'VariableID:1050:39510': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/skateboard
  'VariableID:1050:39522': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/crossfit
  'VariableID:1050:39524': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/elliptical
  'VariableID:1050:39497': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/yoga
  'VariableID:1050:39491': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/workout
  'VariableID:1050:39496': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/weight-training
  'VariableID:1050:39511': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/stair-stepper
  'VariableID:1050:39525': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/wheelchair
  'VariableID:1735:41394': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/race
  'VariableID:1050:39527': 'Spandex - Global Foundations',  // semantic / color/data-viz/sport-type/multiple-activities
  'VariableID:1166:1468701': 'Spandex - Global Foundations',  // semantic / color/data-viz/goal/halo
  'VariableID:1166:1506490': 'Spandex - Global Foundations',  // semantic / color/global/subscription/preview-header/preview-3
  'VariableID:1166:1506491': 'Spandex - Global Foundations',  // semantic / color/global/subscription/preview-header/preview-4
  'VariableID:1166:1506492': 'Spandex - Global Foundations',  // semantic / color/global/subscription/preview-header/preview-5
  'VariableID:1169:37796': 'Spandex - Global Foundations',  // semantic / color/badge/primary
  'VariableID:1459:149320': 'Spandex - Global Foundations',  // semantic / color/global/subscription/upsell-banner
  'VariableID:1741:44263': 'Spandex - Global Foundations',  // semantic / color/map/polyline/primary
  'VariableID:1741:44264': 'Spandex - Global Foundations',  // semantic / color/map/polyline/secondary
  'VariableID:1741:44265': 'Spandex - Global Foundations',  // semantic / color/map/polyline/tertiary
  'VariableID:1741:44266': 'Spandex - Global Foundations',  // semantic / color/map/polyline/case
  'VariableID:1741:44267': 'Spandex - Global Foundations',  // semantic / color/map/polyline/record
  'VariableID:1741:44268': 'Spandex - Global Foundations',  // semantic / color/map/polyline/disabled
  'VariableID:1828:567194': 'Spandex - Global Foundations',  // semantic / color/search/background
  'VariableID:2720:84474': 'Spandex - Global Foundations',  // semantic / color/global/status/error/border
  'VariableID:2969:57706': 'Spandex - Global Foundations',  // semantic / color/startupscreen/background
  'VariableID:5654:1380468': 'Spandex - Global Foundations',  // semantic / color/global/lemon
  'VariableID:5654:1380469': 'Spandex - Global Foundations',  // semantic / color/global/teal
  'VariableID:5654:1380470': 'Spandex - Global Foundations',  // semantic / color/global/maroon
  'VariableID:5654:1380471': 'Spandex - Global Foundations',  // semantic / color/global/moss
  'VariableID:5654:1380472': 'Spandex - Global Foundations',  // semantic / color/global/navy
  'VariableID:5654:1380473': 'Spandex - Global Foundations',  // semantic / color/global/sand
  'VariableID:26:168549': 'Spandex - Global Foundations',  // semantic / color/global/gold
  'VariableID:26:168550': 'Spandex - Global Foundations',  // semantic / color/global/silver
  'VariableID:26:168551': 'Spandex - Global Foundations',  // semantic / color/global/bronze
  'VariableID:2200:42123': 'Spandex - Global Foundations',  // semantic / color/global/transparent
  'VariableID:6035:2690225': 'Spandex - Global Foundations',  // semantic / color/button/survey/default
  'VariableID:6035:2690226': 'Spandex - Global Foundations',  // semantic / color/button/survey/pressed
  'VariableID:6035:2690227': 'Spandex - Global Foundations',  // semantic / color/button/survey/selected
  'VariableID:7782:1494568': 'Spandex - Global Foundations',  // semantic / color/text/quaternary
  'VariableID:7782:1494569': 'Spandex - Global Foundations',  // semantic / color/fill/quaternary
  'VariableID:8186:229222': 'Spandex - Global Foundations',  // semantic / color/record/status/pause/background
  'VariableID:8186:229223': 'Spandex - Global Foundations',  // semantic / color/record/status/acquiring-gps/background
  'VariableID:8186:229224': 'Spandex - Global Foundations',  // semantic / color/record/status/acquiring-gps/foreground
  'VariableID:8186:229225': 'Spandex - Global Foundations',  // semantic / color/record/status/acquired-gps/background
  'VariableID:8186:229226': 'Spandex - Global Foundations',  // semantic / color/record/status/acquired-gps/foreground
  'VariableID:8186:229227': 'Spandex - Global Foundations',  // semantic / color/record/status/no-gps/foreground
  'VariableID:8565:34767': 'Spandex - Global Foundations',  // semantic / color/button/circular/primary/enabled
  'VariableID:8565:34768': 'Spandex - Global Foundations',  // semantic / color/button/circular/primary/pressed
  'VariableID:8565:34769': 'Spandex - Global Foundations',  // semantic / color/button/circular/primary/disabled
  'VariableID:8565:34770': 'Spandex - Global Foundations',  // semantic / color/button/circular/secondary/enabled
  'VariableID:8565:34771': 'Spandex - Global Foundations',  // semantic / color/button/circular/secondary/pressed
  'VariableID:8565:34772': 'Spandex - Global Foundations',  // semantic / color/button/circular/secondary/disabled
  'VariableID:8565:34773': 'Spandex - Global Foundations',  // semantic / color/button/circular/tertiary/enabled
  'VariableID:8565:34774': 'Spandex - Global Foundations',  // semantic / color/button/circular/tertiary/pressed
  'VariableID:8565:34775': 'Spandex - Global Foundations',  // semantic / color/button/circular/tertiary/disabled
  'VariableID:8565:34776': 'Spandex - Global Foundations',  // semantic / color/button/circular/foreground/primary
  'VariableID:8565:34777': 'Spandex - Global Foundations',  // semantic / color/button/circular/foreground/secondary
  'VariableID:8565:34778': 'Spandex - Global Foundations',  // semantic / color/button/circular/foreground/tertiary
  'VariableID:8565:34779': 'Spandex - Global Foundations',  // semantic / color/button/circular/foreground/disabled/primary
  'VariableID:8565:34780': 'Spandex - Global Foundations',  // semantic / color/button/circular/foreground/disabled/secondary
  'VariableID:8565:34781': 'Spandex - Global Foundations',  // semantic / color/button/circular/foreground/disabled/tertiary
  'VariableID:8997:132030': 'Spandex - Global Foundations',  // semantic / color/button/survey/pressed-accent
  'VariableID:8997:132031': 'Spandex - Global Foundations',  // semantic / color/button/survey/selected-accent
  'VariableID:9373:345465': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/sprinting
  'VariableID:10464:67508': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/sprinting-label
  'VariableID:9373:345466': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/attacking
  'VariableID:9373:345467': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/climbing
  'VariableID:9778:50804': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/12-weeks-gradient-start
  'VariableID:9778:50805': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/12-weeks-gradient-end
  'VariableID:9778:50806': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/all-time-gradient-start
  'VariableID:9778:50807': 'Spandex - Global Foundations',  // semantic / color/data-viz/chart/power-skills/all-time-gradient-end
  'VariableID:10453:4148': 'Spandex - Global Foundations',  // semantic / color/tag/default/bg
  'VariableID:10453:4149': 'Spandex - Global Foundations',  // semantic / color/tag/default/border
  'VariableID:10453:4150': 'Spandex - Global Foundations',  // semantic / color/tag/default/foreground
  'VariableID:10453:4151': 'Spandex - Global Foundations',  // semantic / color/tag/pressed/bg
  'VariableID:10453:4152': 'Spandex - Global Foundations',  // semantic / color/tag/pressed/border
  'VariableID:10453:4153': 'Spandex - Global Foundations',  // semantic / color/tag/pressed/foreground
  'VariableID:10453:4154': 'Spandex - Global Foundations',  // semantic / color/tag/selected/bg
  'VariableID:10453:4155': 'Spandex - Global Foundations',  // semantic / color/tag/selected/border
  'VariableID:10453:4156': 'Spandex - Global Foundations',  // semantic / color/tag/selected/foreground
  'VariableID:10596:158046': 'Spandex - Global Foundations',  // semantic / color/button/foreground/destructive
  'VariableID:10596:158050': 'Spandex - Global Foundations',  // semantic / color/button/foreground/disabled/destructive
  'VariableID:9826:42726': 'Spandex - Global Foundations',  // apple-watch / color/live-segment/behind/gradient-start
  'VariableID:9826:42727': 'Spandex - Global Foundations',  // apple-watch / color/live-segment/behind/gradient-end
  'VariableID:9826:42728': 'Spandex - Global Foundations',  // apple-watch / color/live-segment/ahead/gradient-start
  'VariableID:9826:42729': 'Spandex - Global Foundations',  // apple-watch / color/live-segment/ahead/gradient-end
  'VariableID:9826:42730': 'Spandex - Global Foundations',  // apple-watch / color/sport-picker/card/background/upcoming
  'VariableID:9826:42731': 'Spandex - Global Foundations',  // apple-watch / color/sport-picker/card/background/focused
  'VariableID:10255:219784': 'Spandex - Global Foundations',  // apple-watch / color/live-segment/base
};

// Helper function to get library name from component key
function getLibraryNameFromKey(key: string): string | null {
  return COMPONENT_KEY_TO_LIBRARY[key] || null;
}

// Helper function to get library name from variable ID (deprecated - use collection-based mapping)
function getLibraryNameFromVariableId(id: string): string | null {
  return VARIABLE_ID_TO_LIBRARY[id] || null;
}

// ========================================
// Team Library Management
// ========================================

const ENABLED_LIBRARIES_KEY = 'enabledLibraries';

// Load enabled libraries from client storage
async function loadEnabledLibraries(): Promise<Set<string>> {
  const stored = await figma.clientStorage.getAsync(ENABLED_LIBRARIES_KEY);
  if (stored && Array.isArray(stored)) {
    return new Set(stored);
  }
  return new Set();
}

// Save enabled libraries to client storage
async function saveEnabledLibraries(libraries: Set<string>): Promise<void> {
  await figma.clientStorage.setAsync(ENABLED_LIBRARIES_KEY, Array.from(libraries));
}

// Get all available team libraries with their variable collections and components
async function getAvailableLibraries(): Promise<TeamLibrary[]> {
  const libraries = new Map<string, TeamLibrary>();

  try {
    // Get all available variable collections from team libraries
    const variableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    console.log('=== DEBUG: Variable Collections from Team Libraries ===');
    console.log('Total collections:', variableCollections.length);

    for (const collection of variableCollections) {
      // Log all available properties to understand the API
      console.log('\nCollection:', {
        key: collection.key,
        name: collection.name,
        // Check what other properties exist
        allProps: Object.keys(collection)
      });

      // Use the collection key as the library identifier for now
      const libraryKey = collection.key;
      const libraryName = collection.name || 'Unknown Library';

      if (!libraries.has(libraryKey)) {
        libraries.set(libraryKey, {
          key: libraryKey,
          name: libraryName,
          enabled: false,
          hasVariables: false,
          hasComponents: false,
        });
      }
      const lib = libraries.get(libraryKey)!;
      lib.hasVariables = true;
    }
  } catch (error) {
    console.warn('Could not fetch library variable collections:', error);
  }

  // Detect component libraries from currently used components
  try {
    const page = figma.currentPage;
    const componentInstances = page.findAll((node) => node.type === 'INSTANCE') as InstanceNode[];

    const componentLibraries = new Set<string>();

    for (const instance of componentInstances) {
      const mainComponent = instance.mainComponent;
      if (mainComponent && mainComponent.remote) {
        const componentKey = mainComponent.key;
        // Try to get the parent library name
        const parentKey = mainComponent.parent?.name || componentKey;

        console.log('Component from library:', {
          componentName: mainComponent.name,
          componentKey: componentKey,
          parentName: mainComponent.parent?.name
        });

        componentLibraries.add(componentKey);
      }
    }

    console.log('Total component library keys detected:', componentLibraries.size);
  } catch (error) {
    console.warn('Could not detect component libraries:', error);
  }

  return Array.from(libraries.values());
}

// Check if a variable collection belongs to an enabled library
async function isFromEnabledLibrary(collectionKey: string): Promise<{ enabled: boolean; libraryName: string | null }> {
  try {
    const enabledLibraries = await loadEnabledLibraries();
    const variableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();

    for (const collection of variableCollections) {
      if (collection.key === collectionKey) {
        const libraryKey = collection.key;
        const libraryName = collection.name || 'Unknown Library';

        if (enabledLibraries.has(libraryKey)) {
          return { enabled: true, libraryName };
        }
      }
    }
  } catch (error) {
    console.warn('Error checking library status:', error);
  }

  return { enabled: false, libraryName: null };
}

// ========================================
// Legacy Collection-Based Variable Mapping (Deprecated)
// ========================================

const COLLECTION_MAPPINGS_KEY = 'collectionMappings';

// Load collection mappings from client storage
async function loadCollectionMappings(): Promise<Map<string, string>> {
  const stored = await figma.clientStorage.getAsync(COLLECTION_MAPPINGS_KEY);
  if (stored) {
    return new Map(Object.entries(stored));
  }
  return new Map();
}

// Save collection mappings to client storage
async function saveCollectionMappings(mappings: Map<string, string>): Promise<void> {
  const obj = Object.fromEntries(mappings);
  await figma.clientStorage.setAsync(COLLECTION_MAPPINGS_KEY, obj);
}

// Get library name from variable by checking its collection
async function getLibraryNameFromVariable(variable: Variable): Promise<string | null> {
  const mappings = await loadCollectionMappings();
  const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);

  if (!collection) return null;

  // Check if this collection is mapped
  if (collection.key && mappings.has(collection.key)) {
    return mappings.get(collection.key) || null;
  }

  return null;
}

// Detect all variable collections currently in use on the page
function detectVariableCollections(componentInstances: InstanceNode[]): Map<string, DetectedCollection> {
  const collections = new Map<string, DetectedCollection>();
  const collectionVariableCounts = new Map<string, Set<string>>();

  for (const instance of componentInstances) {
    const variableIds = collectVariableIdsRecursive(instance);

    for (const id of variableIds) {
      const variable = figma.variables.getVariableById(id);
      if (!variable) continue;

      const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
      if (!collection) continue;

      const key = collection.key || collection.id;

      if (!collections.has(key)) {
        collections.set(key, {
          key: key,
          name: collection.name,
          remote: collection.remote,
          variableCount: 0
        });
        collectionVariableCounts.set(key, new Set());
      }

      // Track unique variables per collection
      collectionVariableCounts.get(key)?.add(id);
    }
  }

  // Update variable counts
  for (const [key, variableSet] of collectionVariableCounts.entries()) {
    const collection = collections.get(key);
    if (collection) {
      collection.variableCount = variableSet.size;
    }
  }

  return collections;
}

// ========================================

figma.showUI(__html__, { width: 440, height: 720 });

// Send initial selection status to UI
function checkAndSendSelectionStatus() {
  const selection = figma.currentPage.selection;
  const hasSelection = selection.length > 0;

  figma.ui.postMessage({
    type: 'selection-status',
    hasSelection: hasSelection,
    count: selection.length,
  });
}

// Check selection status on plugin open
checkAndSendSelectionStatus();

// Listen for selection changes
figma.on('selectionchange', () => {
  checkAndSendSelectionStatus();
});

// Main analysis function
async function analyzeCoverage(): Promise<CoverageMetrics> {
  const page = figma.currentPage;
  const selection = page.selection;

  // Reset alias tracking for this analysis
  aliasResolutions.clear();

  // Check if user has made a selection
  if (selection.length === 0) {
    throw new Error('Please select frames, components, or sections to analyze');
  }

  console.log(`\n=== ANALYZING SELECTION ===`);
  console.log(`Selected ${selection.length} top-level node(s)`);

  // Find all component instances within the selection
  const componentInstances: InstanceNode[] = [];

  for (const selectedNode of selection) {
    // If the selected node itself is an instance, include it
    if (selectedNode.type === 'INSTANCE') {
      componentInstances.push(selectedNode as InstanceNode);
    }

    // Find all instances within the selected node
    if ('findAll' in selectedNode) {
      const childInstances = selectedNode.findAll(
        (node) => node.type === 'INSTANCE'
      ) as InstanceNode[];
      componentInstances.push(...childInstances);
    }
  }

  console.log(`Found ${componentInstances.length} component instance(s) in selection`);

  let libraryInstances = 0;
  let localInstances = 0;
  let componentsWithVariables = 0;
  let componentsWithoutVariables = 0;

  // Track components by library source
  const librarySourceCounts = new Map<string, number>();

  // Process all instances
  for (const instance of componentInstances) {
    const mainComponent = instance.mainComponent;
    const isLibraryComponent = mainComponent?.remote === true;

    let libraryName = 'Local Components';

    if (isLibraryComponent && mainComponent) {
      // Try to identify the specific library file using component key mapping
      const componentKey = mainComponent.key;

      if (componentKey) {
        const mappedLibrary = getLibraryNameFromKey(componentKey);

        if (mappedLibrary) {
          // Found in our mapping
          libraryName = mappedLibrary;
        } else {
          // Not in mapping - could be another team library or not yet scanned
          libraryName = 'Other Library (not mapped)';
        }
      } else {
        libraryName = 'Other Library (no key)';
      }

      libraryInstances++;
    } else {
      localInstances++;
    }

    // Track count by library source
    const currentCount = librarySourceCounts.get(libraryName) || 0;
    librarySourceCounts.set(libraryName, currentCount + 1);

    // Count variable usage - check instance AND all children
    const hasVariables = checkInstanceForVariables(instance);
    if (hasVariables) {
      componentsWithVariables++;
    } else {
      componentsWithoutVariables++;
    }
  }

  // Calculate coverage percentages
  const totalInstances = libraryInstances + localInstances;
  const componentCoverage =
    totalInstances > 0 ? (libraryInstances / totalInstances) * 100 : 0;

  const totalComponents = componentsWithVariables + componentsWithoutVariables;
  const variableCoverage =
    totalComponents > 0 ? (componentsWithVariables / totalComponents) * 100 : 0;

  // Create library breakdown with percentages
  const libraryBreakdown: LibraryBreakdown[] = Array.from(
    librarySourceCounts.entries()
  )
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalInstances > 0 ? (count / totalInstances) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // ===================================================================
  // DEBUG: Component Key Mapping Status
  // ===================================================================
  console.log('=== COMPONENT KEY MAPPING STATUS ===');

  // Collect unique component keys
  const uniqueKeys = new Set<string>();
  const unmappedKeys: string[] = [];

  for (const instance of componentInstances) {
    const mainComponent = instance.mainComponent;
    if (mainComponent?.remote === true && mainComponent.key) {
      uniqueKeys.add(mainComponent.key);
      if (!getLibraryNameFromKey(mainComponent.key)) {
        unmappedKeys.push(mainComponent.key);
      }
    }
  }

  console.log(`Total unique library component keys: ${uniqueKeys.size}`);
  console.log(`Mapped keys: ${uniqueKeys.size - unmappedKeys.length}`);
  console.log(`Unmapped keys: ${unmappedKeys.length}`);

  if (unmappedKeys.length > 0) {
    console.log('\n⚠️  WARNING: Some components are not mapped to libraries!');
    console.log('Run the Library Scanner plugin to generate the mapping.\n');
    console.log('Sample unmapped keys (first 5):');
    unmappedKeys.slice(0, 5).forEach((key, i) => {
      console.log(`${i + 1}. ${key}`);
    });
  } else if (uniqueKeys.size > 0) {
    console.log('\n✅ All library components are mapped!');
  }

  console.log('\n=== LIBRARY BREAKDOWN ===');
  console.log('Library breakdown:', libraryBreakdown);
  console.log(
    'Total instances:',
    totalInstances,
    'Library:',
    libraryInstances,
    'Local:',
    localInstances
  );

  // ===================================================================
  // Variable Source Tracking (Library-Based)
  // ===================================================================
  console.log('\n=== VARIABLE SOURCE TRACKING ===');

  const variableSourceCounts = new Map<string, number>();
  const allVariableIds = new Set<string>();
  const unmappedVariableIds = new Set<string>();
  const unmappedCollections = new Set<string>();

  // Collect all variable IDs from component instances
  for (const instance of componentInstances) {
    const variableIds = collectVariableIdsRecursive(instance);

    for (const id of variableIds) {
      allVariableIds.add(id);

      const variable = figma.variables.getVariableById(id);
      if (!variable) {
        unmappedVariableIds.add(id);
        continue;
      }

      const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
      if (!collection) {
        unmappedVariableIds.add(id);
        continue;
      }

      const collectionKey = collection.key || collection.id;

      // Check if this variable is from an enabled library
      const libraryInfo = await isFromEnabledLibrary(collectionKey);

      if (libraryInfo.enabled && libraryInfo.libraryName) {
        const currentCount = variableSourceCounts.get(libraryInfo.libraryName) || 0;
        variableSourceCounts.set(libraryInfo.libraryName, currentCount + 1);
      } else {
        unmappedVariableIds.add(id);
        if (collection.remote) {
          unmappedCollections.add(`${collection.name} (from library - not enabled)`);
        }
        // Track unmapped variables as "Other Library (not enabled)"
        const currentCount = variableSourceCounts.get('Other Library (not enabled)') || 0;
        variableSourceCounts.set('Other Library (not enabled)', currentCount + 1);
      }
    }
  }

  console.log(`Total unique variable IDs used: ${allVariableIds.size}`);
  console.log(`Mapped variable IDs: ${allVariableIds.size - unmappedVariableIds.size}`);
  console.log(`Unmapped variable IDs: ${unmappedVariableIds.size}`);
  console.log(`Alias resolutions performed: ${aliasResolutions.size}`);

  // DEBUG: Show alias resolutions
  if (aliasResolutions.size > 0) {
    console.log('\n=== ALIAS RESOLUTIONS (first 5) ===');
    Array.from(aliasResolutions.entries()).slice(0, 5).forEach(([aliasId, sourceId], i) => {
      const aliasVar = figma.variables.getVariableById(aliasId);
      const sourceVar = figma.variables.getVariableById(sourceId);
      console.log(`${i + 1}. Alias: "${aliasId}" (${aliasVar?.name || 'unknown'})`);
      console.log(`   → Source: "${sourceId}" (${sourceVar?.name || 'unknown'})`);
    });
  }

  // DEBUG: Show sample IDs from the page with variable names
  console.log('\n=== SAMPLE VARIABLE IDS FROM PAGE (first 10) ===');
  Array.from(allVariableIds).slice(0, 10).forEach((id, i) => {
    const variable = figma.variables.getVariableById(id);
    const collection = variable ? figma.variables.getVariableCollectionById(variable.variableCollectionId) : null;
    const mapped = VARIABLE_ID_TO_LIBRARY[id];
    console.log(`${i + 1}. "${id}"`);
    console.log(`   Name: ${variable?.name || 'unknown'}`);
    console.log(`   Key: ${variable?.key || 'unknown'}`);
    console.log(`   Remote: ${variable?.remote ?? 'unknown'}`);
    console.log(`   Collection: ${collection?.name || 'unknown'}`);
    console.log(`   Collection Remote: ${collection?.remote ?? 'unknown'}`);
    console.log(`   Collection Key: ${collection?.key || 'unknown'}`);
    console.log(`   Mapped: ${mapped ? '✅ ' + mapped : '❌ Not in mapping'}`);
  });

  // DEBUG: Show enabled libraries
  const enabledLibraries = await loadEnabledLibraries();
  console.log('\n=== ENABLED LIBRARIES ===');
  console.log(`Total enabled libraries: ${enabledLibraries.size}`);
  if (enabledLibraries.size > 0) {
    Array.from(enabledLibraries).forEach((libraryKey, i) => {
      console.log(`${i + 1}. Library Key: ${libraryKey}`);
    });
  } else {
    console.log('No libraries enabled yet. Use Settings to connect libraries.');
  }

  if (unmappedCollections.size > 0) {
    console.log('\n⚠️  WARNING: Some variables are from libraries that are not enabled!');
    console.log('Open Settings to enable these libraries.\n');
    console.log('Variables from non-enabled libraries:');
    Array.from(unmappedCollections).forEach((collectionInfo, i) => {
      console.log(`${i + 1}. ${collectionInfo}`);
    });
    console.log('\nSample unmapped variable IDs (first 10):');
    Array.from(unmappedVariableIds).slice(0, 10).forEach((id, i) => {
      const variable = figma.variables.getVariableById(id);
      const collection = variable ? figma.variables.getVariableCollectionById(variable.variableCollectionId) : null;
      console.log(`${i + 1}. "${id}"`);
      console.log(`   Name: ${variable?.name || 'unknown'}`);
      console.log(`   Collection: ${collection?.name || 'unknown'}`);
    });
  } else if (allVariableIds.size > 0) {
    console.log('\n✅ All variables are mapped!');
  }

  // Create variable breakdown with percentages
  const totalVariableUsages = Array.from(variableSourceCounts.values()).reduce((sum, count) => sum + count, 0);
  const variableBreakdown: LibraryBreakdown[] = Array.from(
    variableSourceCounts.entries()
  )
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalVariableUsages > 0 ? (count / totalVariableUsages) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  console.log('\n=== VARIABLE BREAKDOWN ===');
  console.log('Variable breakdown:', variableBreakdown);
  console.log('Total variable usages:', totalVariableUsages);

  // Count variable-bound properties (for accurate token adoption)
  console.log('\n=== VARIABLE-BOUND PROPERTIES DETECTION ===');
  console.log(`Total component instances found: ${componentInstances.length}`);

  // Limit processing to prevent crashes on large files
  const MAX_INSTANCES_TO_ANALYZE = 1000;
  const instancesToAnalyze = componentInstances.slice(0, MAX_INSTANCES_TO_ANALYZE);

  if (componentInstances.length > MAX_INSTANCES_TO_ANALYZE) {
    console.log(`⚠ Limiting detailed analysis to first ${MAX_INSTANCES_TO_ANALYZE} instances for performance`);
  }

  const variableBoundTotals = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  let processedCount = 0;
  for (const instance of instancesToAnalyze) {
    const bound = countVariableBoundPropertiesRecursive(instance);
    variableBoundTotals.colors += bound.colors;
    variableBoundTotals.typography += bound.typography;
    variableBoundTotals.spacing += bound.spacing;
    variableBoundTotals.radius += bound.radius;

    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount}/${instancesToAnalyze.length} instances...`);
    }
  }

  const totalVariableBound = variableBoundTotals.colors + variableBoundTotals.typography +
                             variableBoundTotals.spacing + variableBoundTotals.radius;

  console.log('Variable-bound colors:', variableBoundTotals.colors);
  console.log('Variable-bound typography:', variableBoundTotals.typography);
  console.log('Variable-bound spacing:', variableBoundTotals.spacing);
  console.log('Variable-bound radius:', variableBoundTotals.radius);
  console.log('Total variable-bound properties:', totalVariableBound);

  // Detect hardcoded values that should use variables
  console.log('\n=== HARDCODED VALUES DETECTION ===');
  const hardcodedTotals = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  processedCount = 0;
  for (const instance of instancesToAnalyze) {
    const hardcoded = detectHardcodedValuesRecursive(instance);
    hardcodedTotals.colors += hardcoded.colors;
    hardcodedTotals.typography += hardcoded.typography;
    hardcodedTotals.spacing += hardcoded.spacing;
    hardcodedTotals.radius += hardcoded.radius;

    processedCount++;
    if (processedCount % 100 === 0) {
      console.log(`Processed ${processedCount}/${instancesToAnalyze.length} instances...`);
    }
  }

  const totalHardcoded = hardcodedTotals.colors + hardcodedTotals.typography +
                         hardcodedTotals.spacing + hardcodedTotals.radius;

  // Collect detailed orphan information (for troubleshooting)
  console.log('\n=== COLLECTING ORPHAN DETAILS ===');
  const orphanDetails: OrphanDetail[] = [];
  for (const instance of instancesToAnalyze) {
    collectOrphanDetails(instance, orphanDetails);
    if (orphanDetails.length >= 100) break; // Limit to first 100
  }
  console.log(`Collected ${orphanDetails.length} orphan details (max 100)`);

  // Calculate TRUE total opportunities (variable-bound + hardcoded)
  // This is the research-backed approach: count ALL properties that could use tokens
  const totalOpportunities = totalVariableBound + totalHardcoded;

  // Calculate ACCURATE Token Adoption (research formula)
  // Token Adoption = Variable Instances / (Variable Instances + Custom Style Values) × 100
  const accurateVariableCoverage = totalOpportunities > 0
    ? (totalVariableBound / totalOpportunities) * 100
    : 0;

  console.log('Hardcoded colors:', hardcodedTotals.colors);
  console.log('Hardcoded typography:', hardcodedTotals.typography);
  console.log('Hardcoded spacing:', hardcodedTotals.spacing);
  console.log('Hardcoded radius:', hardcodedTotals.radius);
  console.log('Total hardcoded values:', totalHardcoded);
  console.log('Total opportunities:', totalOpportunities);
  console.log('ACCURATE Token Adoption:', accurateVariableCoverage.toFixed(1) + '%');

  return {
    componentCoverage,
    variableCoverage: accurateVariableCoverage, // Use accurate property-level token adoption
    stats: {
      totalNodes: componentInstances.length,
      libraryInstances,
      localInstances,
      nodesWithVariables: totalVariableBound, // Now showing property count, not component count
      nodesWithCustomStyles: totalHardcoded, // Now showing hardcoded property count
    },
    libraryBreakdown,
    variableBreakdown,
    hardcodedValues: {
      colors: hardcodedTotals.colors,
      typography: hardcodedTotals.typography,
      spacing: hardcodedTotals.spacing,
      radius: hardcodedTotals.radius,
      totalHardcoded,
      totalOpportunities,
      details: orphanDetails,
    },
  };
}

// Check if an instance (and all its children) use any variables
function checkInstanceForVariables(instance: InstanceNode): boolean {
  // Check the instance itself
  if (checkNodeForVariables(instance)) {
    return true;
  }

  // Recursively check all children
  if ('children' in instance) {
    const children = instance.children as SceneNode[];
    for (const child of children) {
      if (hasVariablesRecursive(child)) {
        return true;
      }
    }
  }

  return false;
}

// Recursively check a node and its children for variables
function hasVariablesRecursive(node: SceneNode): boolean {
  // Check this node
  if (checkNodeForVariables(node)) {
    return true;
  }

  // Check children if this node has them
  if ('children' in node) {
    const children = (node as any).children as SceneNode[];
    for (const child of children) {
      if (hasVariablesRecursive(child)) {
        return true;
      }
    }
  }

  return false;
}

// Check if a single node has bound variables
function checkNodeForVariables(node: any): boolean {
  if (!node.boundVariables) return false;

  const boundVariables = node.boundVariables;

  // Check for variables in fills
  if (boundVariables.fills && Array.isArray(boundVariables.fills)) {
    if (boundVariables.fills.length > 0) return true;
  }

  // Check for variables in strokes
  if (boundVariables.strokes && Array.isArray(boundVariables.strokes)) {
    if (boundVariables.strokes.length > 0) return true;
  }

  // Check for variables in component properties
  if (boundVariables.componentProperties) {
    const props = Object.keys(boundVariables.componentProperties);
    if (props.length > 0) return true;
  }

  // Check for variables in effects
  if (boundVariables.effects && Array.isArray(boundVariables.effects)) {
    if (boundVariables.effects.length > 0) return true;
  }

  // Check for variables in layout grids
  if (boundVariables.layoutGrids && Array.isArray(boundVariables.layoutGrids)) {
    if (boundVariables.layoutGrids.length > 0) return true;
  }

  // Check other common bindable fields (spacing, sizing, radius, opacity, etc.)
  const fields = [
    'topLeftRadius',
    'topRightRadius',
    'bottomLeftRadius',
    'bottomRightRadius',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'itemSpacing',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'counterAxisSpacing',
    'horizontalPadding',
    'verticalPadding',
    'opacity',
    'cornerRadius',
  ];

  for (const field of fields) {
    if (boundVariables[field]) return true;
  }

  // Check text-specific variable bindings
  if (boundVariables.fontSize) return true;
  if (boundVariables.fontFamily) return true;
  if (boundVariables.fontStyle) return true;
  if (boundVariables.fontWeight) return true;
  if (boundVariables.lineHeight) return true;
  if (boundVariables.letterSpacing) return true;
  if (boundVariables.paragraphSpacing) return true;
  if (boundVariables.paragraphIndent) return true;

  // Check text range fills
  if (
    boundVariables.textRangeFills &&
    Array.isArray(boundVariables.textRangeFills)
  ) {
    if (boundVariables.textRangeFills.length > 0) return true;
  }

  return false;
}

// Track alias resolutions for debugging
const aliasResolutions = new Map<string, string>();

// Resolve a variable ID to its source (following alias chain)
function resolveVariableId(id: string): string {
  try {
    const variable = figma.variables.getVariableById(id);
    if (!variable) return id;

    // Check if this variable is an alias by looking at its value
    // In Figma, if a variable value is an object with an 'id' property, it's an alias
    const modeId = Object.keys(variable.valuesByMode)[0];
    const value = variable.valuesByMode[modeId];

    if (value && typeof value === 'object' && 'id' in value) {
      // This is an alias - recursively resolve to find the source
      const aliasedId = (value as any).id;
      const resolvedId = resolveVariableId(aliasedId);
      // Track the resolution for debugging
      if (resolvedId !== id) {
        aliasResolutions.set(id, resolvedId);
      }
      return resolvedId;
    }

    return id;
  } catch (error) {
    // If we can't resolve, return the original ID
    return id;
  }
}

// Collect all variable IDs from a node's bound variables
function collectVariableIds(node: any): Set<string> {
  const variableIds = new Set<string>();

  if (!node.boundVariables) return variableIds;

  const boundVariables = node.boundVariables;

  // Helper to extract IDs from variable bindings and resolve aliases
  const extractId = (binding: any) => {
    if (binding && binding.id) {
      // Resolve aliases to get the source variable ID
      const resolvedId = resolveVariableId(binding.id);
      variableIds.add(resolvedId);
    }
  };

  // Helper to extract IDs from arrays of bindings
  const extractFromArray = (arr: any[]) => {
    if (Array.isArray(arr)) {
      arr.forEach(extractId);
    }
  };

  // Check for variables in fills
  if (boundVariables.fills) {
    extractFromArray(boundVariables.fills);
  }

  // Check for variables in strokes
  if (boundVariables.strokes) {
    extractFromArray(boundVariables.strokes);
  }

  // Check for variables in component properties
  if (boundVariables.componentProperties) {
    const props = Object.values(boundVariables.componentProperties);
    props.forEach(extractId);
  }

  // Check for variables in effects
  if (boundVariables.effects) {
    extractFromArray(boundVariables.effects);
  }

  // Check for variables in layout grids
  if (boundVariables.layoutGrids) {
    extractFromArray(boundVariables.layoutGrids);
  }

  // Check other common bindable fields
  const fields = [
    'topLeftRadius',
    'topRightRadius',
    'bottomLeftRadius',
    'bottomRightRadius',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    'itemSpacing',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'counterAxisSpacing',
    'horizontalPadding',
    'verticalPadding',
    'opacity',
    'cornerRadius',
    'fontSize',
    'fontFamily',
    'fontStyle',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'paragraphSpacing',
    'paragraphIndent',
  ];

  for (const field of fields) {
    if (boundVariables[field]) {
      extractId(boundVariables[field]);
    }
  }

  // Check text range fills
  if (boundVariables.textRangeFills) {
    extractFromArray(boundVariables.textRangeFills);
  }

  return variableIds;
}

// Recursively collect all variable IDs from a node and its children
function collectVariableIdsRecursive(node: any): Set<string> {
  const allIds = new Set<string>();

  // Collect from this node
  const nodeIds = collectVariableIds(node);
  nodeIds.forEach(id => allIds.add(id));

  // Recursively collect from children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      const childIds = collectVariableIdsRecursive(child);
      childIds.forEach(id => allIds.add(id));
    }
  }

  return allIds;
}

// Check if a node should be skipped from analysis (spacers, handles, iOS-specific components)
function isSkippedNode(node: SceneNode): boolean {
  const name = (node.name || '').toLowerCase();

  // Check for layers/components to skip (case-insensitive)
  const skipPatterns = [
    'spacer',
    '.spacer value',
    '_spacervertical',
    '_spacerhorizontal',
    '_spacer',
    'handle',
    'segmentedcontrol-ios',
    'ios home affordance',
    'home indicator',
    'route builder map',
    'wip',
  ];

  return skipPatterns.some(pattern => name.includes(pattern.toLowerCase()));
}

// Count properties using variables (for proper token adoption calculation)
function countVariableBoundProperties(node: SceneNode): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  // Skip hidden layers
  if ('visible' in node && node.visible === false) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const variableBound = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  // Count fills using variables
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);
    if (visibleFills.length > 0 && hasFillVariable) {
      variableBound.colors += visibleFills.length;
    }
  }

  // Count strokes using variables (colors only, not stroke weight)
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;
      const visibleStrokes = strokes.filter((stroke: any) => stroke.visible !== false);

      if (visibleStrokes.length > 0 && hasStrokeVariable) {
        variableBound.colors += visibleStrokes.length;
      }
    }
  }

  // Count radius using variables
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;
    if (node.cornerRadius > 0 && hasRadiusVariable) {
      variableBound.radius++;
    }
  }

  // Spacing excluded from token adoption calculation for now
  // if ('layoutMode' in node && node.layoutMode !== 'NONE') {
  //   const boundVars = node.boundVariables as any;
  //   const hasPaddingVariable = boundVars?.paddingLeft || boundVars?.paddingRight ||
  //                               boundVars?.paddingTop || boundVars?.paddingBottom ||
  //                               boundVars?.horizontalPadding || boundVars?.verticalPadding;
  //   const hasNonZeroPadding = ('paddingLeft' in node && (node as any).paddingLeft > 0) ||
  //                             ('paddingRight' in node && (node as any).paddingRight > 0) ||
  //                             ('paddingTop' in node && (node as any).paddingTop > 0) ||
  //                             ('paddingBottom' in node && (node as any).paddingBottom > 0);
  //   if (hasNonZeroPadding && hasPaddingVariable) variableBound.spacing++;
  //   const hasItemSpacingVariable = boundVars?.itemSpacing;
  //   if ('itemSpacing' in node && typeof node.itemSpacing === 'number' && node.itemSpacing > 0 && hasItemSpacingVariable) {
  //     variableBound.spacing++;
  //   }
  // }

  // Count typography using variables
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (textNode.boundVariables?.fontSize) variableBound.typography++;
      if (textNode.boundVariables?.lineHeight) variableBound.typography++;
      if (textNode.boundVariables?.letterSpacing) variableBound.typography++;
      if (textNode.boundVariables?.fontFamily) variableBound.typography++;
      if (textNode.boundVariables?.fontWeight) variableBound.typography++;
    }
  }

  return variableBound;
}

// Detect hardcoded values that should use variables
function detectHardcodedValues(node: SceneNode): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  // Skip hidden layers
  if ('visible' in node && node.visible === false) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const hardcoded = {
    colors: 0,
    typography: 0,
    spacing: 0,
    radius: 0,
  };

  // Check for hardcoded fills (colors)
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;

    // Count fills that don't have variables bound
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);
    if (visibleFills.length > 0 && !hasFillVariable) {
      hardcoded.colors += visibleFills.length;
    }
  }

  // Check for hardcoded strokes (colors only, not stroke weight)
  if ('strokes' in node && node.strokes) {
    const strokes = node.strokes;
    if (Array.isArray(strokes)) {
      const hasStrokeVariable = node.boundVariables?.strokes && Array.isArray(node.boundVariables.strokes) && node.boundVariables.strokes.length > 0;

      const visibleStrokes = strokes.filter((stroke: any) => stroke.visible !== false);
      if (visibleStrokes.length > 0 && !hasStrokeVariable) {
        hardcoded.colors += visibleStrokes.length; // Color only
      }
    }
  }

  // Check for hardcoded corner radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius ||
                               boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius ||
                               boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;

    if (node.cornerRadius > 0 && !hasRadiusVariable) {
      hardcoded.radius++;
    }
  }

  // Spacing excluded from orphan rate calculation for now
  // if ('layoutMode' in node && node.layoutMode !== 'NONE') {
  //   const boundVars = node.boundVariables as any;
  //   const hasPaddingVariable = boundVars?.paddingLeft ||
  //                               boundVars?.paddingRight ||
  //                               boundVars?.paddingTop ||
  //                               boundVars?.paddingBottom ||
  //                               boundVars?.horizontalPadding ||
  //                               boundVars?.verticalPadding;
  //   const hasNonZeroPadding = ('paddingLeft' in node && (node as any).paddingLeft > 0) ||
  //                             ('paddingRight' in node && (node as any).paddingRight > 0) ||
  //                             ('paddingTop' in node && (node as any).paddingTop > 0) ||
  //                             ('paddingBottom' in node && (node as any).paddingBottom > 0);
  //   if (hasNonZeroPadding && !hasPaddingVariable) {
  //     hardcoded.spacing++;
  //   }
  //   const hasItemSpacingVariable = boundVars?.itemSpacing;
  //   if ('itemSpacing' in node && typeof node.itemSpacing === 'number' && node.itemSpacing > 0 && !hasItemSpacingVariable) {
  //     hardcoded.spacing++;
  //   }
  // }

  // Check for hardcoded typography
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;

    const hasFontSizeVariable = textNode.boundVariables?.fontSize;
    const hasLineHeightVariable = textNode.boundVariables?.lineHeight;
    const hasLetterSpacingVariable = textNode.boundVariables?.letterSpacing;
    const hasFontFamilyVariable = textNode.boundVariables?.fontFamily;
    const hasFontWeightVariable = textNode.boundVariables?.fontWeight;

    // Check if using text styles instead of variables
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (!hasFontSizeVariable) hardcoded.typography++;
      if (!hasLineHeightVariable) hardcoded.typography++;
      if (!hasLetterSpacingVariable) hardcoded.typography++;
      if (!hasFontFamilyVariable) hardcoded.typography++;
      if (!hasFontWeightVariable) hardcoded.typography++;
    }
  }

  return hardcoded;
}

// Detect hardcoded values WITH details for troubleshooting
function detectHardcodedValuesWithDetails(node: SceneNode): OrphanDetail | null {
  // Skip hidden layers
  if ('visible' in node && node.visible === false) {
    return null;
  }

  // Skip intentionally ignored layers (spacers, handles, iOS components)
  if (isSkippedNode(node)) {
    return null;
  }

  const properties: string[] = [];
  const values: string[] = [];
  let category: 'colors' | 'typography' | 'spacing' | 'radius' | null = null;

  // Check for hardcoded typography (most common issue)
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    const hasTextStyle = textNode.textStyleId && textNode.textStyleId !== '';

    if (!hasTextStyle) {
      if (!textNode.boundVariables?.fontSize && textNode.fontSize !== figma.mixed) {
        properties.push('fontSize');
        values.push(`${textNode.fontSize}px`);
      }
      if (!textNode.boundVariables?.lineHeight && textNode.lineHeight !== figma.mixed) {
        const lh = textNode.lineHeight;
        properties.push('lineHeight');
        values.push(typeof lh === 'object' && 'value' in lh ? `${lh.value}${lh.unit === 'PIXELS' ? 'px' : '%'}` : String(lh));
      }
      if (!textNode.boundVariables?.letterSpacing && textNode.letterSpacing !== figma.mixed) {
        const ls = textNode.letterSpacing;
        properties.push('letterSpacing');
        values.push(typeof ls === 'object' && 'value' in ls ? `${ls.value}${ls.unit === 'PIXELS' ? 'px' : '%'}` : String(ls));
      }
      if (!textNode.boundVariables?.fontFamily && textNode.fontName !== figma.mixed) {
        properties.push('fontFamily');
        values.push(textNode.fontName ? (typeof textNode.fontName === 'object' ? textNode.fontName.family : String(textNode.fontName)) : 'mixed');
      }
      if (!textNode.boundVariables?.fontWeight && textNode.fontName !== figma.mixed) {
        properties.push('fontWeight');
        values.push(textNode.fontName ? (typeof textNode.fontName === 'object' ? textNode.fontName.style : 'mixed') : 'mixed');
      }

      if (properties.length > 0) {
        category = 'typography';
      }
    }
  }

  // Check for hardcoded colors
  if ('fills' in node && node.fills !== figma.mixed) {
    const fills = node.fills as readonly Paint[];
    const hasFillVariable = node.boundVariables?.fills && Array.isArray(node.boundVariables.fills) && node.boundVariables.fills.length > 0;
    const visibleFills = fills.filter((fill: any) => fill.visible !== false);

    if (visibleFills.length > 0 && !hasFillVariable) {
      if (!category) category = 'colors';
      properties.push('fill');
      visibleFills.forEach((fill: any, i) => {
        if (fill.type === 'SOLID' && fill.color) {
          const r = Math.round(fill.color.r * 255);
          const g = Math.round(fill.color.g * 255);
          const b = Math.round(fill.color.b * 255);
          values.push(`rgb(${r}, ${g}, ${b})`);
        }
      });
    }
  }

  // Check for hardcoded radius
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
    const boundVars = node.boundVariables as any;
    const hasRadiusVariable = boundVars?.cornerRadius || boundVars?.topLeftRadius ||
                               boundVars?.topRightRadius || boundVars?.bottomLeftRadius ||
                               boundVars?.bottomRightRadius;

    if (!hasRadiusVariable) {
      if (!category) category = 'radius';
      properties.push('cornerRadius');
      values.push(`${node.cornerRadius}px`);
    }
  }

  if (properties.length > 0 && category) {
    return {
      nodeId: node.id,
      nodeName: node.name || 'Unnamed',
      nodeType: node.type,
      category,
      properties,
      values,
    };
  }

  return null;
}

// Recursively count variable-bound properties
function countVariableBoundPropertiesRecursive(node: SceneNode, depth: number = 0): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  const MAX_DEPTH = 50; // Prevent stack overflow on deeply nested components

  // Early return: skip this node and ALL its descendants if it matches skip patterns
  if (isSkippedNode(node) || ('visible' in node && node.visible === false)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const totals = countVariableBoundProperties(node);

  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      // Skip hidden layers and intentionally ignored layers
      if (('visible' in child && child.visible === false) || isSkippedNode(child)) {
        continue;
      }
      const childBound = countVariableBoundPropertiesRecursive(child, depth + 1);
      totals.colors += childBound.colors;
      totals.typography += childBound.typography;
      totals.spacing += childBound.spacing;
      totals.radius += childBound.radius;
    }
  }

  return totals;
}

// Recursively detect hardcoded values in node tree
function detectHardcodedValuesRecursive(node: SceneNode, depth: number = 0): {
  colors: number;
  typography: number;
  spacing: number;
  radius: number;
} {
  const MAX_DEPTH = 50; // Prevent stack overflow on deeply nested components

  // Early return: skip this node and ALL its descendants if it matches skip patterns
  if (isSkippedNode(node) || ('visible' in node && node.visible === false)) {
    return { colors: 0, typography: 0, spacing: 0, radius: 0 };
  }

  const totals = detectHardcodedValues(node);

  // Recursively check children
  if (depth < MAX_DEPTH && 'children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      // Skip hidden layers and intentionally ignored layers
      if (('visible' in child && child.visible === false) || isSkippedNode(child)) {
        continue;
      }
      const childHardcoded = detectHardcodedValuesRecursive(child, depth + 1);
      totals.colors += childHardcoded.colors;
      totals.typography += childHardcoded.typography;
      totals.spacing += childHardcoded.spacing;
      totals.radius += childHardcoded.radius;
    }
  }

  return totals;
}

// Recursively collect detailed orphan information
function collectOrphanDetails(node: SceneNode, details: OrphanDetail[], depth: number = 0): void {
  const MAX_DEPTH = 50;
  const MAX_DETAILS = 100; // Limit to prevent performance issues

  if (depth >= MAX_DEPTH || details.length >= MAX_DETAILS) return;

  // Early return: skip this node and ALL its descendants if it matches skip patterns
  if (isSkippedNode(node) || ('visible' in node && node.visible === false)) {
    return;
  }

  // Check this node for orphans
  const orphan = detectHardcodedValuesWithDetails(node);
  if (orphan) {
    details.push(orphan);
  }

  // Check children
  if ('children' in node) {
    const children = node.children as SceneNode[];
    for (const child of children) {
      if (details.length >= MAX_DETAILS) break;
      // Skip hidden layers and intentionally ignored layers
      if (('visible' in child && child.visible === false) || isSkippedNode(child)) {
        continue;
      }
      collectOrphanDetails(child, details, depth + 1);
    }
  }
}

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'analyze') {
    try {
      const metrics = await analyzeCoverage();
      figma.ui.postMessage({
        type: 'results',
        data: metrics,
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  } else if (msg.type === 'get-libraries') {
    try {
      const availableLibraries = await getAvailableLibraries();
      const enabledLibraries = await loadEnabledLibraries();

      // Mark which libraries are currently enabled
      for (const library of availableLibraries) {
        library.enabled = enabledLibraries.has(library.key);
      }

      figma.ui.postMessage({
        type: 'libraries',
        libraries: availableLibraries,
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to load libraries',
      });
    }
  } else if (msg.type === 'save-libraries') {
    try {
      const libraryKeys = msg.libraries || [];
      const enabledLibraries = new Set<string>(libraryKeys);
      await saveEnabledLibraries(enabledLibraries);
      console.log('Enabled libraries saved:', libraryKeys);
    } catch (error) {
      console.error('Failed to save libraries:', error);
      figma.ui.postMessage({
        type: 'error',
        message: 'Failed to save library settings',
      });
    }
  } else if (msg.type === 'select-node') {
    try {
      const nodeId = msg.nodeId;
      const node = figma.getNodeById(nodeId);

      if (node) {
        // Select the node and zoom to it
        figma.currentPage.selection = [node as SceneNode];
        figma.viewport.scrollAndZoomIntoView([node as SceneNode]);

        figma.ui.postMessage({
          type: 'node-selected',
          nodeName: node.name,
        });
      } else {
        figma.ui.postMessage({
          type: 'error',
          message: 'Node not found. It may have been deleted.',
        });
      }
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to select node',
      });
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Auto-run analysis on plugin load
setTimeout(async () => {
  const metrics = await analyzeCoverage();
  figma.ui.postMessage({
    type: 'results',
    data: metrics,
  });
}, 100);
