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

export function TemplateBPdf(props: Props) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{props.fullName}</Text>
        <Text style={styles.contact}>
          {props.email}
          {props.phone ? ` | ${props.phone}` : ""}
        </Text>
        <View style={styles.headerRule} />
      </View>

      <Section title="Career Objective" content={props.summary} />
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

//style

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,

    fontFamily: "Times-Roman",
    lineHeight: 1.4,
  },

  header: {
    marginBottom: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    color: "#2563eb",
  },

  contact: {
    fontSize: 10,
    marginTop: 5,
    color: "#444",
  },

  headerRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    marginTop: 4,
  },

  section: {
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    color: "#2563eb",
    marginBottom: 3,
    textTransform:"uppercase",
  },

  sectionText: {
    fontSize: 10,
  },
});
