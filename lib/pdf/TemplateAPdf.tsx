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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{props.fullName}</Text>
        <Text style={styles.contact}>
          {props.email}
          {props.phone ? ` | ${props.phone}` : ""}
        </Text>
      </View>

      <Divider />

      <Section title="Professional Summary" content={props.summary} />
      <Section title="Skills" content={props.skills} />
      <Section title="Education" content={props.education} />
      <Section title="Experience" content={props.experience} />
      <Section title="Projects" content={props.projects} />
      <Section title="Certifications" content={props.certifications} />
    </Page>
  );
}

//helprs

function Section({ title, content }: { title: string; content?: string }) {
  if (!content || !content.trim()) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.rule} />
      <Text style={styles.sectionText}>{content}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.mainRule} />;
}

//styles

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10.5,
    fontFamily: "Helvetica",

    lineHeight: 1.5,
  },

  header: {
    textAlign: "center",
    marginBottom: 12,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
  },

  contact: {
    fontSize: 10,
    marginTop: 4,
    color: "#444",
  },

  mainRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 12,
  },

  section: {
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
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
