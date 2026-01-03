import PengumumanForm from "./components/PengumumanForm";

interface Role {
    id: number;
    name: string;
}

interface Props {
    pengumuman: any;
    roles: Role[];
}

export default function Edit({ pengumuman, roles }: Props) {
    return <PengumumanForm pengumuman={pengumuman} roles={roles} isEdit={true} />;
}
