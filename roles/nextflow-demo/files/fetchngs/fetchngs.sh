nextflow run nf-core/fetchngs -r 1.12.0 \
-profile singularity \
--max_cpus 2 \
--max_memory 2GB \
--max_time 1h \
--outdir fetchngs/output \
-work-dir fetchngs/work \
--input fetchngs/inputs.csv