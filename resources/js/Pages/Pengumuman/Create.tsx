import PengumumanForm from "./components/PengumumanForm";

interface Role {
    id: number;
    name: string;
}

interface Props {
    roles: Role[];
}

export default function Create({ roles }: Props) {
    return <PengumumanForm roles={roles} />;
}
