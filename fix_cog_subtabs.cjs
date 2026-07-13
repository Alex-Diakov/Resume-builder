const fs = require('fs');
let content = fs.readFileSync('components/SidebarCognitiveTab.tsx', 'utf8');

content = content.replace("Обзор", "Overview");
content = content.replace("Законы UX", "UX Laws");
content = content.replace("Модели", "Models");

const oldSticky = '<div className="sticky top-3 z-30 mx-5 mt-4 mb-4 flex bg-ds-panel/95 backdrop-blur-md p-1.5 rounded-xl border border-ds-border shadow-lg">';
const newSticky = `<div className="sticky top-0 z-30 bg-ds-container pt-4 pb-4 px-5 -mx-5 mb-2 mt-0">
          <div className="flex bg-ds-panel/95 backdrop-blur-md p-1.5 rounded-xl border border-ds-border shadow-lg">`;

content = content.replace(oldSticky, newSticky);
// Since we added a <div>, we need to add a closing </div> where the sticky div ends.
// Let's find the closing tag for the sticky div.
// It looks like:
/*
          </button>
        </div>
      )}
*/
content = content.replace(/          <\/button>\n        <\/div>\n      \)}/, "          </button>\n          </div>\n        </div>\n      )}");

fs.writeFileSync('components/SidebarCognitiveTab.tsx', content);
