const fs = require('fs');

let content = fs.readFileSync('components/SidebarFormTab.tsx', 'utf8');

// Replace standard text/email inputs
content = content.replace(
  /<input\s+type="(text|email)"\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]+)\}\s+className="[^"]+"\s*(placeholder="[^"]*")?\s*\/>/g,
  '<Input type="$1" value={$2} onChange={(e) => $3} $4 />'
);

// Replace inputs that have defaultValue instead of value
content = content.replace(
  /<input\s+type="(text|email)"\s+defaultValue=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]+)\}\s+className="[^"]+"\s*(placeholder="[^"]*")?\s*\/>/g,
  '<Input type="$1" defaultValue={$2} onChange={(e) => $3} $4 />'
);

// Any remaining inputs with that class
content = content.replace(
  /<input\s+type="(text|email)"\s+value=\{([^}]+)\}\s+onChange=\{([^}]+)\}\s+className="[^"]+"\s*(placeholder="[^"]*")?\s*\/>/g,
  '<Input type="$1" value={$2} onChange={$3} $4 />'
);

// Replace textareas
content = content.replace(
  /<textarea\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]+)\}\s+className="[^"]+"\s*(placeholder="[^"]*")?\s*\/>/g,
  '<Textarea value={$1} onChange={(e) => $2} $3 />'
);
content = content.replace(
  /<textarea\s+value=\{([^}]+)\}\s+onChange=\{\(e\) => ([^}]+)\}\s+className="[^"]+"\s*(placeholder="[^"]*")?\s*><\/textarea>/g,
  '<Textarea value={$1} onChange={(e) => $2} $3 />'
);

fs.writeFileSync('components/SidebarFormTab.tsx', content);
console.log('Fixed all inputs');
