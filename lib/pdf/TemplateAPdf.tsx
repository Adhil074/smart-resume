//lib\pdf\TemplateAPdf.tsx

import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type Props = {
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  skills?: string;
  education?: string;
  experience?: string;
  projects?: string;
  certifications?: string;
};

export function TemplateAPdf(props: Props) {
  return (
    <Page size="A4" style={styles.page}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.name}>{props.fullName}</Text>
        <Text style={styles.contact}>
          {props.email}
          {props.phone ? ` | ${props.phone}` : ""}
        </Text>
      </View>

      

      <Section title="Professional Summary" content={props.summary} />
      <Section title="Skills" content={props.skills} />
      <Section title="Education" content={props.education} />
      <Section title="Experience" content={props.experience} />
      <Section title="Projects" content={props.projects} />
      <Section title="Certifications" content={props.certifications} />
    </Page>
  );
}

//helpers

function Section({ title, content }: { title: string; content?: string }) {
  if (!content || !content.trim()) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{content}</Text>
    </View>
  );
}



//styles

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10.5,
    
    fontFamily: "Times-Roman",
    lineHeight: 1.45,
  },

  header: {
    textAlign: "center",
    marginBottom: 8,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily:"Times-Bold",
    marginBottom:7,
  },

  contact: {
    fontSize: 10,
    marginTop: 4,
    color: "#444",
  },

  mainRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 6,
    marginBottom:8,
  },

  section: {
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily:"Times-Bold",
    marginTop:10,
    marginBottom:4,
    borderBottomWidth:0.5,
    borderBottomColor:"#999",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  rule: {
    borderBottomWidth: 0.7,
    borderBottomColor: "#999",
    marginVertical: 4,
  },

  sectionText: {
    fontSize: 10.5,
    marginTop: 4,
  },
});
