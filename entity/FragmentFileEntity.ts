import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "https://denolib.com/denolib/typeorm@v0.2.23-rc9/mod.ts";
import { IFragmentFile } from "./interfaces/IFragmentFile.ts";
import { Fragment } from "./FragmentEntity.ts";

@Entity()
export class FragmentFile implements IFragmentFile {

    @PrimaryGeneratedColumn()
    id = 0;

    @OneToOne(type => Fragment, fragment => fragment.fileInfo)
    @JoinColumn()
    fragment = undefined;

    @Column({type:"varchar", length: 512, nullable: false})
    filePath = "";

    @Column({type:"varchar", length: 256, nullable: false})
    fileType = "";

    @Column({type:"varchar", length: 64, nullable: false})
    md5 = "";

    @Column({type:"varchar", length: 80, nullable:false})
    sha1 = "";

    @UpdateDateColumn()
    updated_at?:Date;

    @CreateDateColumn()
    created_at?:Date;
}