import Header from "@/components/Header";

export default function InfoPage() {
    return (
        <>
            <Header position="relative" />
            <div className="page-content subpage-container layout-grid">
                <div className="hero col-span-4">
                    <h1 className="project-title">关于 DCDE</h1>
                    <p className="project-subtitle">在秩序中寻找变量</p>
                </div>

                <p className="main-text col-span-4">
                    我们不仅仅是一个校园社团，更是一个植根于东辰、视野向外延伸的青年设计实验场。DCDE 致力于消除「学生作品」与「专业设计」之间的刻板界限，将每一次创作视为对现有秩序的挑战，或对混乱现实的重构。
                    <br /><br />
                    这就好像我们在构建一个虚拟的物理空间，这里存放着我们的思考、焦虑、试错与最终的输出。这是一场关于成长的漫长实验。
                </p>
            </div>
        </>
    );
}
