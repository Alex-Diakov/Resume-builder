import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ExternalHyperlink,
  AlignmentType,
  BorderStyle,
} from 'docx';
import saveAs from 'file-saver';
import { ResumeData } from '../types';

export async function exportToDocx(resumeData: ResumeData) {
  // Construct clean filename matching PDF conventions
  const rawFullName = (resumeData.name || 'Resume').trim();
  const nameParts = rawFullName.split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const cleanFirst = firstName.replace(/[^a-zA-Z0-9а-яА-Я-]/g, '').trim();
  const cleanLast = lastName.replace(/[^a-zA-Z0-9а-яА-Я- ]/g, '').replace(/\s+/g, '_').trim();
  const nameStr = `${cleanFirst}${cleanLast ? '_' + cleanLast : ''}` || 'Resume';
  const fileName = `${nameStr}_Resume.docx`;

  const children: Paragraph[] = [];

  // 1. NAME
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: resumeData.name || 'Alex Diakov',
          bold: true,
          size: 36, // 18pt
          font: 'Arial',
          color: '111827',
        }),
      ],
    })
  );

  // 2. TITLE
  if (resumeData.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: resumeData.title,
            size: 24, // 12pt
            font: 'Arial',
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // 3. CONTACT LINE
  const contactRuns: (TextRun | ExternalHyperlink)[] = [];
  const addSeparator = () => {
    if (contactRuns.length > 0) {
      contactRuns.push(
        new TextRun({
          text: '  •  ',
          size: 19,
          color: '9CA3AF',
          font: 'Arial',
        })
      );
    }
  };

  if (resumeData.contact?.email) {
    addSeparator();
    contactRuns.push(
      new TextRun({
        text: resumeData.contact.email,
        size: 19,
        color: '374151',
        font: 'Arial',
      })
    );
  }

  if (resumeData.contact?.location) {
    addSeparator();
    contactRuns.push(
      new TextRun({
        text: resumeData.contact.location,
        size: 19,
        color: '374151',
        font: 'Arial',
      })
    );
  }

  if (resumeData.contact?.website) {
    addSeparator();
    const linkUrl = resumeData.contact.website.startsWith('http') 
      ? resumeData.contact.website 
      : `https://${resumeData.contact.website}`;
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'Portfolio',
            size: 19,
            color: '4F46E5',
            underline: {},
            font: 'Arial',
          }),
        ],
        link: linkUrl,
      })
    );
  }

  if (resumeData.contact?.linkedin) {
    addSeparator();
    const linkUrl = resumeData.contact.linkedin.startsWith('http') 
      ? resumeData.contact.linkedin 
      : `https://${resumeData.contact.linkedin}`;
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'LinkedIn',
            size: 19,
            color: '4F46E5',
            underline: {},
            font: 'Arial',
          }),
        ],
        link: linkUrl,
      })
    );
  }

  if (resumeData.contact?.videoPitch) {
    addSeparator();
    const linkUrl = resumeData.contact.videoPitch.startsWith('http') 
      ? resumeData.contact.videoPitch 
      : `https://${resumeData.contact.videoPitch}`;
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: 'Video Pitch',
            size: 19,
            color: 'E11D48',
            bold: true,
            underline: {},
            font: 'Arial',
          }),
        ],
        link: linkUrl,
      })
    );
  }

  if (contactRuns.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        children: contactRuns,
      })
    );
  }

  // HELPER FOR SECTION HEADERS
  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: 'D1D5DB',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          font: 'Arial',
          color: '111827',
        }),
      ],
    });
  };

  // 4. SUMMARY
  if (resumeData.summary && resumeData.summary.length > 0) {
    children.push(createSectionHeader('Professional Summary'));
    resumeData.summary.forEach((paragraphText) => {
      if (paragraphText.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: paragraphText,
                size: 20, // 10pt
                font: 'Arial',
                color: '374151',
              }),
            ],
          })
        );
      }
    });
  }

  // 5. EXPERIENCE
  if (resumeData.experience && resumeData.experience.length > 0) {
    children.push(createSectionHeader('Professional Experience'));

    resumeData.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 21,
              font: 'Arial',
              color: '111827',
            }),
            new TextRun({
              text: `  |  ${exp.company}`,
              bold: true,
              size: 21,
              font: 'Arial',
              color: '4F46E5',
            }),
            new TextRun({
              text: `  (${exp.duration}${exp.type ? ' • ' + exp.type : ''})`,
              size: 19,
              font: 'Arial',
              color: '6B7280',
            }),
          ],
        })
      );

      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((hl) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: `${hl.title}: `,
                  bold: true,
                  size: 20,
                  font: 'Arial',
                  color: '111827',
                }),
                new TextRun({
                  text: hl.description,
                  size: 20,
                  font: 'Arial',
                  color: '374151',
                }),
              ],
            })
          );
        });
      }
    });
  }

  // 6. PROJECTS / VENTURES
  if (resumeData.projects && resumeData.projects.length > 0) {
    children.push(createSectionHeader('Product Ventures & Key Projects'));

    resumeData.projects.forEach((proj) => {
      const headerRuns: (TextRun | ExternalHyperlink)[] = [
        new TextRun({
          text: proj.title,
          bold: true,
          size: 21,
          font: 'Arial',
          color: '111827',
        }),
      ];

      if (proj.role) {
        headerRuns.push(
          new TextRun({
            text: ` — ${proj.role}`,
            bold: true,
            size: 20,
            font: 'Arial',
            color: '4F46E5',
          })
        );
      }

      if (proj.link) {
        const linkUrl = proj.link.startsWith('http') ? proj.link : `https://${proj.link}`;
        headerRuns.push(
          new TextRun({
            text: '  [',
            size: 19,
            color: '6B7280',
            font: 'Arial',
          }),
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: 'Demo / Video',
                size: 19,
                color: 'E11D48',
                underline: {},
                font: 'Arial',
              }),
            ],
            link: linkUrl,
          }),
          new TextRun({
            text: ']',
            size: 19,
            color: '6B7280',
            font: 'Arial',
          })
        );
      }

      children.push(
        new Paragraph({
          spacing: { before: 140, after: 60 },
          children: headerRuns,
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: proj.description,
                size: 20,
                font: 'Arial',
                color: '374151',
              }),
            ],
          })
        );
      }

      if (proj.details && proj.details.length > 0) {
        proj.details.forEach((det) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${det.label}: `,
                  bold: true,
                  size: 19,
                  font: 'Arial',
                  color: '111827',
                }),
                new TextRun({
                  text: det.value,
                  size: 19,
                  font: 'Arial',
                  color: '4B5563',
                }),
              ],
            })
          );
        });
      }
    });
  }

  // 7. SKILLS / CORE COMPETENCIES
  if (resumeData.skills && Object.keys(resumeData.skills).length > 0) {
    children.push(createSectionHeader('Core Competencies & Technical Skills'));

    Object.entries(resumeData.skills).forEach(([category, val]) => {
      if (val.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: `${category}: `,
                bold: true,
                size: 20,
                font: 'Arial',
                color: '111827',
              }),
              new TextRun({
                text: val,
                size: 20,
                font: 'Arial',
                color: '374151',
              }),
            ],
          })
        );
      }
    });
  }

  // 8. EDUCATION & CERTIFICATIONS
  if (resumeData.education && resumeData.education.length > 0) {
    children.push(createSectionHeader('Education & Certifications'));

    resumeData.education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: edu.certification,
              bold: true,
              size: 20,
              font: 'Arial',
              color: '111827',
            }),
            new TextRun({
              text: ` — ${edu.institution}`,
              size: 20,
              font: 'Arial',
              color: '4B5563',
            }),
            new TextRun({
              text: ` (${edu.year})`,
              size: 19,
              font: 'Arial',
              color: '6B7280',
            }),
          ],
        })
      );
    });
  }

  // 9. ATS KEYWORDS (IF PRESENT)
  if (resumeData.atsKeywords && resumeData.atsKeywords.trim()) {
    children.push(createSectionHeader('ATS Keywords & Optimization'));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: resumeData.atsKeywords,
            size: 18,
            font: 'Arial',
            color: '6B7280',
            italic: true,
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
