nextflow run nf-core/fetchngs -r 1.12.0 \
-profile conda \
--max_cpus 2 \
--max_memory 2GB \
--max_time 1h \
--outdir fetchngs/output \
-work-dir fetchngs/work \
--input inputs.csv